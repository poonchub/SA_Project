package entity

import "gorm.io/gorm"

type Brand struct {
	gorm.Model
	Name 	string
	Picture	[]byte

	Products	[]Product	`gorm:"foreignKey:BrandID"`
}