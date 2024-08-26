package entity

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name 	string

	Products	[]Product	`gorm:"foreignKey:CategoryID"`

	OwnerID uint
	Owner	Owner `gorm:"foriegnKey:OwnerID"`
}