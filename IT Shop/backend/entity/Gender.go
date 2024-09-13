package entity

import "gorm.io/gorm"

type Gender struct {
	gorm.Model
	Name string

	Customers []Customer `gorm:"foreignKey:GenderID"`
	Owners []Owner `gorm:"foreignKey:GenderID"`
}
