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

//func DBinstance() *mongo.Client {
//	err := godotenv.Load(".env")
//	if err != nil {
//		log.Fatal("Error loading .env file")
//	}
//
//	MongoDb := os.Getenv("MONGO_DB")
//
//	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
//	defer cancel()
//
//	client, err := mongo.Connect(ctx, options.Client().ApplyURI(MongoDb))
//	if err != nil {
//		log.Fatal(err)
//	}
//
//	err = client.Ping(ctx, nil)
//	if err != nil {
//		log.Fatal(err)
//	}
//	return client
//}
//
//// Global MongoDB client instance
//var Client *mongo.Client = DBinstance()
//
//// OpenCollection returns a reference to a collection in the database
//func OpenCollection(client *mongo.Client, collectionName string) *mongo.Collection {
//	// Get the MongoDB database name from environment variables
//	dbName := os.Getenv("MONGO_DB_NAME")
//
//	// Return a collection handle for the specified collection
//	return client.Database(dbName).Collection(collectionName)
//}

// Example usage of OpenCollection
//func main() {
//	collection := OpenCollection(Client, "example_collection")
//	fmt.Println("Connected to collection:", collection.Name())
//}

// Old Code
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

// Function connects with a collection in the database
var Client *mongo.Client = DBinstance()

func OpenCollection(collectionName string) *mongo.Collection {
	var collection *mongo.Collection = Client.Database(os.Getenv("MONGO_DB_NAME")).Collection(collectionName)
	return collection
}
