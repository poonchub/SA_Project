package entity

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	BrandName 	string
	ImagePath	string

	Products	[]Product	`gorm:"foreignKey:BrandID"`
}