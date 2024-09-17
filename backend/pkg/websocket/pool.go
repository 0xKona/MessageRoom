package websocket

import (
	"encoding/json"
	"fmt"
)

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

type BodyStruct struct {
	UserID   string
	UserName string
	Text     string
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))

			fmt.Println("Client ID: ", client.ID)
			fmt.Println("Client Name: ", client.Name)

			joiningUserBody := &BodyStruct{
				UserID:   client.ID,
				UserName: client.Name,
				Text:     fmt.Sprintf("%s has joined", client.Name),
			}

			// Broadcast the new user's ID to all clients in the pool
			for c := range pool.Clients {
				bodyText, _ := json.Marshal(joiningUserBody)
				if err := c.Conn.WriteJSON(Message{Type: 2, Body: string(bodyText)}); err != nil {
					fmt.Println(err)
					return
				}
			}
			break

		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))

			leaverUserID := client.ID

			// Broadcast user disconnection to all clients in the pool
			for c := range pool.Clients {
				bodyText := fmt.Sprintf("%s has left.", leaverUserID)
				if err := c.Conn.WriteJSON(Message{Type: 2, Body: bodyText}); err != nil {
					fmt.Println(err)
					return
				}
			}
			break

		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")

			// Broadcast any general message to all clients in the pool
			for c := range pool.Clients {
				if err := c.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
		}
	}
}
