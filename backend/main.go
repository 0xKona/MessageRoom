package main

import (
	"fmt"
	"github.com/0xKona/MessageRoom/pkg/database/middleware"
	routes "github.com/0xKona/MessageRoom/pkg/database/routes"
	"github.com/0xKona/MessageRoom/pkg/websocket"
	"github.com/gin-gonic/gin"
	"os"
	"sync"
)

// setupRoutes : Routes incoming HTTP Requests to the relevant API
func setupRoutes() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	routes.UserRoutes(router)
	router.Use(middleware.Authentication())
	return router
}

// setupWebsockets : Routes incoming websocket requests to relevant API
func setupWebsockets() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	pool := websocket.NewPool()
	go pool.Start()
	router.GET("/ws", func(c *gin.Context) {
		websocket.ServeWs(*pool, c.Writer, c.Request)
	})
	return router
}

func main() {
	fmt.Println("Test Websocket App v0.01 Starting...")

	httpPort := os.Getenv("HTTP_PORT")
	if httpPort == "" {
		httpPort = "8080"
	}

	websocketPort := os.Getenv("WEBSOCKET_PORT")
	if websocketPort == "" {
		websocketPort = "8090"
	}

	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		defer wg.Done()
		httpRouter := setupRoutes()
		err := httpRouter.Run(":" + httpPort)
		if err != nil {
			panic(err)
		}
	}()

	wg.Add(1)
	go func() {
		defer wg.Done()
		websocketRouter := setupWebsockets()
		err := websocketRouter.Run(":" + websocketPort)
		if err != nil {

			panic(err)
		}
	}()

	wg.Wait()
}
