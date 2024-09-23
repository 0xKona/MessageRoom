package middleware

import (
	"fmt"
	"github.com/0xKona/MessageRoom/pkg/database/helpers"
	"github.com/gin-gonic/gin"
	"net/http"
)

// Validates token and authorizes user
func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("** Authentication Middleware Called")
		clientToken := c.Request.Header.Get("token")
		if clientToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No authorization token provided"})
			c.Abort()
			return
		}

		claims, err := helpers.ValidateToken(clientToken)
		if err != "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err})
			c.Abort()
			return
		}

		c.Set("email", claims.Email)
		c.Set("username", claims.UserName)
		c.Set("userID", claims.UserID)

		c.Next()
	}
}
