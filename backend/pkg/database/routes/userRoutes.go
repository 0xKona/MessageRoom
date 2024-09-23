package routes

import (
	"github.com/0xKona/MessageRoom/pkg/database/controllers"
	"github.com/gin-gonic/gin"
)

// user Routes
func UserRoutes(incomingRoutes *gin.Engine) {
	incomingRoutes.POST("/users/signup", controllers.Signup())
	incomingRoutes.POST("/users/login", controllers.Login())
	incomingRoutes.GET("/users/test", controllers.Test())
}
