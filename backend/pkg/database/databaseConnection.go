package database

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"time"
)

// Client is an instance of the MongoDB client.
var Client *mongo.Client = DBinstance()

// DBinstance connects to the MongoDB database and returns a client.
func DBinstance() *mongo.Client {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	mongoURI := os.Getenv("MONGO_DB")
	if mongoURI == "" {
		log.Fatal("MONGO_DB environment variable is not set")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatalf("Failed to create new MongoDB client: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	// Ping the database to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatalf("Failed to ping MongoDB: %v", err)
	}

	fmt.Println("Server connected to MongoDB successfully")

	// Call the function to create indexes
	createIndexes(client)

	return client
}

// OpenCollection opens a collection in the database.
func OpenCollection(collectionName string) *mongo.Collection {
	dbName := os.Getenv("MONGO_DB_NAME")
	if dbName == "" {
		log.Fatal("MONGO_DB_NAME environment variable is not set")
	}

	collection := Client.Database(dbName).Collection(collectionName)
	return collection
}

// createIndexes creates necessary indexes on the collections adn prevents duplicate entries.
func createIndexes(client *mongo.Client) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	userCollection := client.Database(os.Getenv("MONGO_DB_NAME")).Collection("user")

	// Create a unique index on the email field
	emailIndexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true).SetBackground(true),
	}

	_, err := userCollection.Indexes().CreateOne(ctx, emailIndexModel)
	if err != nil {
		log.Printf("Error creating index on email field: %v", err)
	} else {
		fmt.Println("Unique index created on email field")
	}

	// Create a unique index on the userID field
	userIDIndexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "userID", Value: 1}},
		Options: options.Index().SetUnique(true).SetBackground(true),
	}

	_, err = userCollection.Indexes().CreateOne(ctx, userIDIndexModel)
	if err != nil {
		log.Printf("Error creating index on userID field: %v", err)
	} else {
		fmt.Println("Unique index created on userID field")
	}
}
