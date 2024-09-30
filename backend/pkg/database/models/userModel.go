package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type User struct {
	ID           primitive.ObjectID `bson:"_id"`
	UserName     *string            `bson:"username" json:"username" validate:"required,min=2,max=100"`
	UserID       *string            `bson:"userID" json:"userID"`
	Password     *string            `bson:"password" json:"password" validate:"required,min=6"`
	Email        *string            `bson:"email" json:"email" validate:"required,email"`
	Token        *string            `bson:"token" json:"token"`
	RefreshToken *string            `bson:"refresh_token" json:"refresh_token"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}
