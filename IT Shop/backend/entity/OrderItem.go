package entity

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	Quantity	int8
	Price 		float32

	OrderID		uint
	Order		Order	`gorm:"foreignKey:OrderID"`

	ProductID	uint
	Product		Product	`gorm:"foreignKey:ProductID"`
}