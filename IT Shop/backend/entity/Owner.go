package entity

import "gorm.io/gorm"

type Owner struct {
	gorm.Model
	FirstName   string
	LastName    string
	Email       string
	Password    string
	ProfilePath string

	GenderID uint
	Gender   Gender `gorm:"foriegnKey:GenderID"`
}
