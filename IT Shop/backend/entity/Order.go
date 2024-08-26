package entity

import (
	"time"
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	OrderDate	time.Time
	TotalPrice	*float32
	Status		string

	OrderItems		[]OrderItem		`gorm:"foreignKey:OrderID"`
	Payments		[]Payment		`gorm:"foreignKey:OrderID"`

	CustomerID	uint
	Customer	Customer	`gorm:"foreignKey:CustomerID"`

	AddressID	uint
	Address		Address		`gorm:"foreignKey:AddressID"`

}