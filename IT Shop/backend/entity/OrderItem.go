package entity

import "gorm.io/gorm"

type OrderItem struct {
	gorm.Model
	Quantity	int8
	Price 		float32

	OrderID		uint
	Order		Order	`gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE;"`

	ProductID	uint
	Product		Product	`gorm:"foreignKey:ProductID"`
}