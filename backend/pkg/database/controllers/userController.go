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

// HashPassword : Used to encrypt password before it is stored in database, takes a string as an argument
func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Fatal(err)
	}
	return string(bytes)
}

/*
VerifyPassword : Takes a stored (hashed) password and a user provided password (string) and checks if they match.
returns a boolean (true if matches / false if not) and an error message (string)
*/
func VerifyPassword(hashedPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
	if err != nil {
		return false, "Login or password is incorrect"
	}
	return true, ""
}

/*
Signup : gin handlerFunction allowing users to sign up and use the application
*/
func Signup() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("[User Signup]")
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

		var user models.User

		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			cancel()
			return
		}

		validationError := validate.Struct(user)
		if validationError != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": validationError.Error()})
			cancel()
			return
		}

		count, err := userCollection.CountDocuments(ctx, bson.M{"email": user.Email})
		defer cancel()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occurred while checking for the email"})
			log.Panic("Error counting documents: ", err)
			return
		}

		if count > 0 {
			c.JSON(http.StatusConflict, gin.H{"error": "email already taken"})
			return
		}

		password := HashPassword(*user.Password)
		user.Password = &password

		user.CreatedAt = time.Now()
		user.UpdatedAt = time.Now()
		user.ID = primitive.NewObjectID()

		if user.UserID == nil {
			userID := user.ID.Hex()
			user.UserID = &userID
		} else {
			*user.UserID = user.ID.Hex()
		}
		token, refreshToken, _ := helpers.GenerateAllTokens(*user.Email, *user.UserName, *user.UserID)
		user.Token = &token
		user.RefreshToken = &refreshToken

		resultInsertionNumber, insertErr := userCollection.InsertOne(ctx, user)
		if insertErr != nil {
			msg := fmt.Sprintf("Error occured while inserting user into database %s", insertErr.Error())
			c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
			return
		}
		defer cancel()

		c.JSON(http.StatusOK, resultInsertionNumber)
	}
}

func Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		var user models.User
		var foundUser models.User

		// Bind the request JSON to the user model
		if err := c.BindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			cancel()
			return
		}
		// Find the user by email in the database
		err := userCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&foundUser)
		defer cancel()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "login or password is incorrect"})
			return
		}
		// Ensure that both passwords (user and foundUser) are not nil
		if user.Password == nil || foundUser.Password == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "login or password is incorrect"})
			return
		}
		// Verify the password by comparing the provided password with the stored hashed password
		passwordIsValid, msg := VerifyPassword(*foundUser.Password, *user.Password)

		if !passwordIsValid {
			c.JSON(http.StatusBadRequest, gin.H{"error": msg})
			return
		}
		// Generate new tokens and update them in the database
		token, refreshToken, _ := helpers.GenerateAllTokens(*foundUser.Email, *foundUser.UserName, *foundUser.UserID)
		helpers.UpdateAllTokens(token, refreshToken, *foundUser.UserID)
		// Return the found user data upon successful login
		c.JSON(http.StatusOK, foundUser)
	}
}

type Password struct {
	Password string `json:"password"`
}

func DeleteUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Step 1: Extract token from headers
		token := c.Request.Header.Get("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		// Step 2: Validate the JWT and extract user details
		claims, errStr := helpers.ValidateToken(token)
		if errStr != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}
		fmt.Println("User: ", claims)

		// Ensure UserID exists and is not empty
		if claims.UserID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
			return
		}

		// Step 3: Extract the password from the request body
		var passwordData Password
		if err := c.BindJSON(&passwordData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		fmt.Println("Provided password: ", passwordData.Password)

		// Step 4: Find the user in the database
		var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
		defer cancel()

		var foundUser models.User
		err := userCollection.FindOne(ctx, bson.M{"user_id": claims.UserID}).Decode(&foundUser)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		fmt.Println("Found Password: ", foundUser.Password)
		// Step 5: Verify the password
		if foundUser.Password == nil || passwordData.Password == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid password"})
			return
		}

		passwordIsValid, msg := VerifyPassword(*foundUser.Password, passwordData.Password)
		if !passwordIsValid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": msg})
			return
		}

		// Step 6: Delete the user from the database
		deleteResult, err := userCollection.DeleteOne(ctx, bson.M{"user_id": claims.UserID})
		if err != nil || deleteResult.DeletedCount == 0 {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
			return
		}

		// Step 7: Return a success response
		c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
	}
}
