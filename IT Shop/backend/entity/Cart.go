package entity

import "gorm.io/gorm"

type Cart struct {
	gorm.Model
	Quantity	int8

	CustomerID	uint
	Customer	Customer	`gorm:"foreignKey:CustomerID"`

	ProductID	uint
	Product		Product		`gorm:"foreignKey:ProductID"`
}