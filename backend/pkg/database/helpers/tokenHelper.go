package helpers

import (
	"context"
	"github.com/0xKona/MessageRoom/pkg/database"
	jwt "github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

type SignedDetails struct {
	Email    string
	UserName string
	UserID   string
	jwt.StandardClaims
}

var userCollection *mongo.Collection = database.OpenCollection("user")
var SECRET_KEY string = os.Getenv("SECRET_KEY")

// GenerateAllTokens generates both the detailed token and the refresh token.
func GenerateAllTokens(email string, userName string, userID string) (signedToken string, signedRefreshToken string, err error) {
	claims := &SignedDetails{
		Email:    email,
		UserName: userName,
		UserID:   userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * 24).Unix(),
		},
	}

	refreshClaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * 168).Unix(),
		},
	}

	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Printf("Error generating token: %v", err)
		return "", "", err
	}

	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Printf("Error generating refresh token: %v", err)
		return "", "", err
	}

	return token, refreshToken, nil
}

// ValidateToken validates the JWT token.
func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(SECRET_KEY), nil
		},
	)

	if err != nil {
		msg = err.Error()
		return nil, msg
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok || !token.Valid {
		msg = "The token is invalid"
		return nil, msg
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = "The token is expired"
		return nil, msg
	}

	return claims, ""
}

// UpdateAllTokens renews user tokens when they log in.
func UpdateAllTokens(signedToken string, signedRefreshToken string, userID string) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	updateObj := bson.D{
		{"token", signedToken},
		{"refresh_token", signedRefreshToken},
		{"updated_at", time.Now()},
	}

	// Set upsert false to prevent creating new documents if the filter doesn't match.
	upsert := false
	filter := bson.M{"userID": userID}
	opt := options.UpdateOptions{
		Upsert: &upsert,
	}

	updateResult, err := userCollection.UpdateOne(
		ctx,
		filter,
		bson.D{
			{"$set", updateObj},
		},
		&opt,
	)

	if err != nil {
		log.Printf("Error updating tokens for userID %s: %v", userID, err)
		return
	}
	if updateResult.MatchedCount == 0 {
		log.Printf("No user found with userID: %s", userID)
		return
	}

	log.Printf("Tokens updated for userID: %s", userID)
}
