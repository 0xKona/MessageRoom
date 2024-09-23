package main

import (
	"fmt"
	"github.com/0xKona/MessageRoom/pkg/database/middleware"
	routes "github.com/0xKona/MessageRoom/pkg/database/routes"
	"github.com/0xKona/MessageRoom/pkg/websocket"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"sync"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}
	userID := r.URL.Query().Get("userID")
	userName := r.URL.Query().Get("userName")
	client := &websocket.Client{
		ID:   userID,
		Name: userName,
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}

func setupRoutes() *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	routes.UserRoutes(router)
	pool := websocket.NewPool()
	go pool.Start()
	router.GET("/ws", func(c *gin.Context) {
		serveWs(pool, c.Writer, c.Request)
	})
	router.Use(middleware.Authentication())
	return router
}

func main() {
	fmt.Println("Test Websocket App v0.01 Starting...")
	// New Code
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	var wg sync.WaitGroup
	//setupRoutes()
	wg.Add(1)
	go func() {
		defer wg.Done()
		router := setupRoutes()
		err := router.Run(":" + port)
		if err != nil {
			panic(err)
		}
	}()
	wg.Wait()

	//pool := websocket.NewPool()
	//go pool.Start()
	//
	//http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
	//	serveWs(pool, w, r)
	//})

	//wg.Add(1)
	//go func() {
	//	defer wg.Done()
	//	pool := websocket.NewPool()
	//	go pool.Start()
	//	mux := http.NewServeMux()
	//	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
	//		serveWs(pool, w, r)
	//	})
	//	server := &http.Server{
	//		Addr:    ":" + "8081",
	//		Handler: mux,
	//	}
	//	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
	//		panic(err)
	//	}
	//}()
	wg.Wait()

	//err := http.ListenAndServe(":"+port, router)
	//err := http.ListenAndServe(":8080", nil)
	//if err != nil {
	//	fmt.Println("Error starting server", err)
	//	return
	//}
}
