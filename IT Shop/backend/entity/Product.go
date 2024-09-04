package entity

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	ProductName	 	string
	Description		string
	PricePerPiece	float32
	Stock			int8
	
	Carts			[]Cart		`gorm:"foreignKey:ProductID"`
	OrderItems		[]OrderItem	`gorm:"foreignKey:ProductID"`
	Image			[]Image		`gorm:"foreignKey:ProductID"`

	CategoryID		uint
	Category		Category	`gorm:"foreignKey:CategoryID"`

	BrandID			uint
	Brand			Brand		`gorm:"foreignKey:BrandID"`
}