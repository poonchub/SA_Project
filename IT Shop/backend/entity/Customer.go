package entity

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	gorm.Model
	Prefix		string
	FirstName	string
	LastName	string
	Email		string
	Password	string
	Birthday	time.Time
	ProfilePath	string

	Carts		[]Cart		`gorm:"foreignKey:CustomerID;references:ID"`
	Address		[]Address	`gorm:"foreignKey:CustomerID"`
	Orders		[]Order		`gorm:"foreignKey:CustomerID"`
	Payments	[]Payment	`gorm:"foreignKey:CustomerID"`

}