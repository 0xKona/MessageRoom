package database

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

// DBinstance : Connects to the mongo database and returns a client that can interacted with
func DBinstance() *mongo.Client {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	MongoDb := os.Getenv("MONGO_DB")

	client, err := mongo.NewClient(options.Client().ApplyURI(MongoDb))
	if err != nil {
		log.Fatal("Failed Setting up new mongo client", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal("Failed to connect to db: ", err)
	}
	fmt.Println("Server connected to MongoDB successfully")
	return client
}

// Client : An instance of DBinstance to connect with a collection in the database
var Client *mongo.Client = DBinstance()

/*
OpenCollection : Takes a collectionName as a string, finds it in the Client and returns the collection,
allowing you to manipulate records
*/
func OpenCollection(collectionName string) *mongo.Collection {
	var collection *mongo.Collection = Client.Database(os.Getenv("MONGO_DB_NAME")).Collection(collectionName)
	return collection
}
