package entity

import "gorm.io/gorm"

type Owner struct {
	gorm.Model
	Prefix		string
	FirstName	string
	LastName	string
	AdminRole	string
	Email		string
	Password	string

	Categories	[]Category	`gorm:"foreignKey:OwnerID"`
}