package config

import (
	"fmt"
	"main/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

func SetupDatabase() {

	db.AutoMigrate(
		&entity.Customer{}, 
		&entity.Address{}, 
		&entity.Order{}, 
		&entity.Payment{}, 
		&entity.OrderItem{}, 
		&entity.Product{}, 
		&entity.Brand{}, 
		&entity.Category{}, 
		&entity.Owner{}, 
		&entity.Cart{}, 
		&entity.Picture{},
	)

	Owner := []*entity.Owner{
		{
			Prefix: "Mr.",
			FirstName: "Poonchub",
			LastName: "Nanawan",
			AdminRole: "Owner",
			Email: "poonchubnanawan310@gmail.com",
			Password: "123456",
		},
	}
	db.Create(&Owner)

	categories := []*entity.Category{
		{
			Name: "NoteBook",
			OwnerID: 1,
		},
		{
			Name: "SmartTV",
			OwnerID: 1,
		},
		{
			Name: "Smartphone",
			OwnerID: 1,
		},
	}
	db.Create(&categories)

	brands := []*entity.Brand{
		{
			Name: "ASUS",
		},
		{
			Name: "LENOVO",
		},
		{
			Name: "DELL",
		},
		{
			Name: "ACER",
		},
		{
			Name: "SUMSUNG",
		},
	}
	db.Create(&brands)

	products := []*entity.Product{
		{
			ProductName: "NoteBook Gaming 1", 
			Description: "Description...", 
			PricePerPiece: 23990.00,
			Stock: 20,
			CategoryID: 1,
			BrandID: 1,
		},
		{
			ProductName: "SmartTV", 
			Description: "Description...", 
			PricePerPiece: 3990.00,
			Stock: 15,
			CategoryID: 2,
			BrandID: 5,
		},
		{
			ProductName: "NoteBook Gaming 2", 
			Description: "Description...", 
			PricePerPiece: 23990.00,
			Stock: 20,
			CategoryID: 1,
			BrandID: 2,
		},	
	}
	db.Create(&products)
}