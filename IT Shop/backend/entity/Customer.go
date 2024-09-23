package entity

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	FirstName   string
	LastName    string
	Email       string
	Password    string
	Birthday    time.Time
	ProfilePath string
	PhoneNumber string

	Carts    []Cart    `gorm:"foreignKey:CustomerID;references:ID"`
	Address  []Address `gorm:"foreignKey:CustomerID"`
	Orders   []Order   `gorm:"foreignKey:CustomerID"`
	Payments []Payment `gorm:"foreignKey:CustomerID"`

	GenderID uint
	Gender   Gender `gorm:"foriegnKey:GenderID"`
}
