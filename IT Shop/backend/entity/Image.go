package entity

import "gorm.io/gorm"

type Image struct{
	gorm.Model
	FilePath	string 		
	
	ProductID	uint
	Product		Product		`gorm:"foreignKey:ProductID"`
}