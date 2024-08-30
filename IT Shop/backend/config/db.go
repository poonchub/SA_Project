package config

import (
	"fmt"
	"io/ioutil"
	"main/entity"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("ITShop.db?cache=shared"), &gorm.Config{})
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

	Owner := &entity.Owner{
		Prefix: "Mr.",
		FirstName: "Poonchub",
		LastName: "Nanawan",
		AdminRole: "Owner",
		Email: "poonchubnanawan310@gmail.com",
		Password: "123456",
	}
	db.FirstOrCreate(Owner, &entity.Owner{
		Email: "poonchubnanawan310@gmail.com",
	})

	categories := []*entity.Category{
		{
			Name: "NoteBook",
			OwnerID: 1,
		},
		{
			Name: "Monitor",
			OwnerID: 1,
		},
		{
			Name: "Ram",
			OwnerID: 1,
		},
	}
	for _, category := range categories{
		db.FirstOrCreate(category, &entity.Category{
			Name: category.Name,
		})
	}

	brands := []*entity.Brand{
		{
			Name: "ASUS",
		},
		{
			Name: "LENOVO",
		},
		{
			Name: "T-FORCE",
		},
		{
			Name: "ACER",
		},
		{
			Name: "SUMSUNG",
		},
	}
	for _, brand := range brands{
		db.FirstOrCreate(brand, &entity.Brand{
			Name: brand.Name,
		})
	}

	// Create Product
	products := []*entity.Product{
		{
			ProductName: "NOTEBOOK (โน้ตบุ๊ค) ASUS TUF GAMING F15 FX507ZC4-HN087W", 
			Description: 	`Brands	ASUS
							Model	F15 FX507ZC4-HN087W
							Processors	Intel® Core™ i5-12500H Processors (12th Gen)
							Processor Speed	2.5 GHz (18M Cache, up to 4.5 GHz, 12 cores: 4 P-cores and 8 E-cores)
							Video Graphics	NVIDIA® GeForce RTX™ 3050 Laptop GPU 4GB GDDR6
							Screen Size	15.6"
							Display	FHD (1920 x 1080) 16:9, Value IPS-level, anti-glare display, sRGB:62.50%, Adobe:47.34%, Refresh Rate:144Hz, Adaptive-Sync, -, MUX Switch + Optimus
							Memory	16GB DDR4 3200MHz
							Storage	512GB PCIe® 3.0 NVMe™ M.2 SSD
							Operating System	Windows 11 Home
							Camera	720p HD camera
							Optical Drive	No
							Connection ports	1 x HDMI 2.0, 1 x USB 3.2 Gen 2 Type-C support DisplayPort, 1 x Thunderbolt™ 4 support DisplayPort, 2 x USB 3.2 Gen 1 Type-A, 1 x 3.5mm Combo Audio Jack, 1 x RJ45
							Wi-Fi/ Bluetooth	Wi-Fi 6(802.11ax)+Bluetooth 5.1 (Dual band) 2*2;(*BT version may change with OS upgrades.)
							Battery	4-Cell Li-ion Battery, 56WHrs, 4S1P
							Color	BLACK
							Dimensions	354 x 251 x 22.4 mm.
							Weight	2.20 kg
							Warranty	2 Years`, 
			PricePerPiece: 28990.00,
			Stock: 20,
			CategoryID: 1,
			BrandID: 1,
		},
		{
			ProductName: "MONITOR (จอมอนิเตอร์) LENOVO G24E-20 - 23.8 VA FHD 100Hz", 
			Description: 	`Brands	LENOVO
							Display Size (in.)	24\"
							Panel Type	VA Technology
							Resolution	1920 x 1080
							Display color	16.7 Million
							Brightness	(100% APL)
							Contrast ratio	3000 : 1
							Response Time	1ms
							Aspect Ratio	16 : 9
							Refresh Rate	100Hz
							Screen Curvature	-
							Power Consumption	20 Watt
							HDMI Port	2 x HDMI 2.0
							Display Port	1x DisplayPort™ 1.2
							DVI Port	-
							Mini DisplayPort	-
							VGA Port	5 x VGA
							USB Hub	N/A
							Adaptive Sync	AMD FreeSync™ Premium
							Dimension (W x H x D)	52.50 x 323.15 x 539.75 mm
							Color	BLACK
							Warranty	3 Years`, 
			PricePerPiece: 4390.00,
			Stock: 15,
			CategoryID: 2,
			BrandID: 2,
		},
		{
			ProductName: "RAM (แรม) T-FORCE VULCAN 8GB (8x1) DDR5 5200MHz RED (FLBD58G5200HC40C01)", 
			Description: 	`Brand	T-FORCE
							Memory Series	T-FORCE VULCAN
							Memory Capacity	8GB (8GBx1)
							Cas Latency	CL40
							Memory Type	DDR5
							Tested Latency	40-40-40-76
							SPD Voltage	1.25 V
							Memory Color	RED
							Warranty	Lifetime`, 
			PricePerPiece: 1190.00,
			Stock: 20,
			CategoryID: 3,
			BrandID: 3,
		},	
	}
	for _, product := range products{
		db.FirstOrCreate(product, &entity.Product{
			ProductName: product.ProductName,
		})
	}

	// Create Picture Product
	for i:=uint(1); i<=3 ;i++{
		for j:=1 ; j<=5 ; j++ {
			path := fmt.Sprintf("images/product/product%d/p0%d.jpg", i, j)
			err := createPicture(path, i)
			if err != nil {
				panic(err)
			}
		}
	}
}

func createBrand(Name string, filePath string) error {
    imageData, err := ioutil.ReadFile(filePath)
    if err != nil {
        return err
    }

    image := entity.Brand{Name: Name ,Picture: imageData}

	if err := db.Where("name = ?", &image.Name).FirstOrCreate(&image).Error; err != nil {
        return err
    }

    return nil
}

func createPicture(filePath string, id uint) error {
    imageData, err := ioutil.ReadFile(filePath)
    if err != nil {
        return err
    }

    image := entity.Picture{File: imageData, ProductID: id}

	if err := db.Where("file = ?", &image.File).FirstOrCreate(&image).Error; err != nil {
        return err
    }

    return nil
}