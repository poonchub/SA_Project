package entity

import "gorm.io/gorm"

type Owner struct {
	gorm.Model
	FirstName   string
	LastName    string
	AdminRole   string
	Email       string
	Password    string
	ProfilePath string

	Categories []Category `gorm:"foreignKey:OwnerID"`

	GenderID uint
	Gender   Gender `gorm:"foriegnKey:GenderID"`
}
