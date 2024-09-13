package entity

import (
	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	Amount      float32
	SlipPath    string `gorm:"type:longtext"`

	CustomerID uint
	Customer   Customer `gorm:"foreignKey:CustomerID"`

	OrderID uint
	Order   Order `gorm:"foreignKey:OrderID"`
}
