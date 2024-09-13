package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	PaymentDate time.Time
	Amount      float32
	SlipPath    string `gorm:"type:longtext"`

	CustomerID uint
	Customer   Customer `gorm:"foreignKey:CustomerID"`

	OrderID uint
	Order   Order `gorm:"foreignKey:OrderID"`
}
