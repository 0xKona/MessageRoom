package middleware

import (
	"fmt"
	"github.com/0xKona/MessageRoom/pkg/database/helpers"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

// Authentication middleware validates the token and authorizes the user.
func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("** Authentication Middleware Called")

		// Extract the token from the Authorization header.
		// The header should be in the format: "Authorization: Bearer <token>"
		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No authorization token provided"})
			c.Abort()
			return
		}

		// Split the header to isolate the token.
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		clientToken := parts[1]

		// Validate the token.
		claims, errStr := helpers.ValidateToken(clientToken)
		if errStr != "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": errStr})
			c.Abort()
			return
		}

		// Set the user information in the context for use in downstream handlers.
		c.Set("email", claims.Email)
		c.Set("username", claims.UserName)
		c.Set("userID", claims.UserID)

		c.Next()
	}
}
