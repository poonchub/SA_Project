package entity

import "gorm.io/gorm"

type Picture struct{
	gorm.Model
	File 		[]byte
	
	ProductID	uint
	Product		Product		`gorm:"foreignKey:ProductID"`
}