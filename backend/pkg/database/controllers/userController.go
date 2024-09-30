package controllers

import (
	"context"
	"fmt"
	"github.com/0xKona/MessageRoom/pkg/database"
	"github.com/0xKona/MessageRoom/pkg/database/helpers"
	"github.com/0xKona/MessageRoom/pkg/database/models"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = database.OpenCollection("user")
var validate = validator.New()

// HashPassword encrypts the password before storing it in the database.
func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Fatal(err)
	}
	return string(bytes)
}

// VerifyPassword checks if the provided password matches the stored hashed password.
func VerifyPassword(hashedPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
	if err != nil {
		return false, "Login or password is incorrect"
	}
	return true, ""
}

// Signup allows users to sign up and use the application.
func Signup() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("[User Signup]")
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		validationError := validate.Struct(user)
		if validationError != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationError.Error()})
			return
		}

		count, err := userCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred while checking for the email"})
			log.Printf("Error counting documents: %v", err)
			return
		}

		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already taken"})
			return
		}

		password := HashPassword(*user.Password)
		user.Password = &password

		user.CreatedAt = time.Now()
		user.UpdatedAt = time.Now()
		user.ID = primitive.NewObjectID()
		userID := user.ID.Hex()
		user.UserID = &userID

		token, refreshToken, _ := helpers.GenerateAllTokens(*user.Email, *user.UserName, *user.UserID)
		user.Token = &token
		user.RefreshToken = &refreshToken

		_, insertErr := userCollection.InsertOne(ctx, user)
		if insertErr != nil {
			msg := fmt.Sprintf("Error occurred while inserting user into database: %s", insertErr.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User signed up successfully"})
	}
}

// Login handles user login and token generation.
func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var user models.User
		var foundUser models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Login or password is incorrect"})
			return
		}

		if user.Password == nil || foundUser.Password == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Login or password is incorrect"})
			return
		}

		passwordIsValid, msg := VerifyPassword(*foundUser.Password, *user.Password)
		if !passwordIsValid {
			c.JSON(http.StatusBadRequest, gin.H{"error": msg})
			return
		}

		token, refreshToken, _ := helpers.GenerateAllTokens(*foundUser.Email, *foundUser.UserName, *foundUser.UserID)
		helpers.UpdateAllTokens(token, refreshToken, *foundUser.UserID)

		// Update the tokens in the foundUser struct before returning
		foundUser.Token = &token
		foundUser.RefreshToken = &refreshToken

		c.JSON(http.StatusOK, foundUser)
	}
}

// Password struct for handling password input in JSON format.
type Password struct {
	Password string `json:"password"`
}

// DeleteUser deletes a user account after verifying the password.
func DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract token from headers
		token := c.Request.Header.Get("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Validate the JWT and extract user details
		claims, errStr := helpers.ValidateToken(token)
		if errStr != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// Ensure UserID exists and is not empty
		if claims.UserID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
			return
		}

		// Extract the password from the request body
		var passwordData Password
		if err := c.BindJSON(&passwordData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Find the user in the database
		ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var foundUser models.User
		err := userCollection.FindOne(ctx, bson.M{"userID": claims.UserID}).Decode(&foundUser)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		// Verify the password
		if foundUser.Password == nil || passwordData.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
			return
		}

		passwordIsValid, msg := VerifyPassword(*foundUser.Password, passwordData.Password)
		if !passwordIsValid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// Delete the user from the database
		deleteResult, err := userCollection.DeleteOne(ctx, bson.M{"userID": claims.UserID})
		if err != nil || deleteResult.DeletedCount == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
	}
}
