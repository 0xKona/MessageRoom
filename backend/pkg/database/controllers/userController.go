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

// Used to encrypt password before it is stored in database
func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		log.Fatal(err)
	}
	return string(bytes)
}

func VerifyPassword(hashedPassword string, providedPassword string) (bool, string) {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
	if err != nil {
		return false, "Login or password is incorrect"
	}
	return true, ""
}

func Signup() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("**Signup Called**")
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
			log.Panic("Error counting documents: ", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error occured while checking for the email"})
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
		//*user.UserID = user.ID.Hex()
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
		fmt.Println("Password is valid: ", passwordIsValid)

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

func Test() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("TEST SUCCESS")
		c.JSON(http.StatusOK, gin.H{})
	}
}
