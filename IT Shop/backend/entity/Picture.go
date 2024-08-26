package entity

import "gorm.io/gorm"

type Picture struct{
	gorm.Model
	File 		[]byte
	
	ProductID	string
	Product		Product		`gorm:"foreignKey:ProductID"`
}