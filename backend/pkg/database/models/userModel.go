package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type User struct {
	ID           primitive.ObjectID `bson:"_id"`
	UserName     *string            `json:"UserName" validate:"required,min=2,max=100"`
	UserID       *string            `json:"UserID"`
	Password     *string            `json:"Password" validate:"required,min=6"`
	Email        *string            `json:"Email" validate:"required,email"`
	Token        *string            `json:"Token"`
	RefreshToken *string            `json:"RefreshToken"`
	CreatedAt    time.Time          `json:"CreatedAt"`
	UpdatedAt    time.Time          `json:"UpdatedAt"`
}
