package config

import (
	"fmt"
	"io/ioutil"
	"main/entity"
	"time"

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
		&entity.Image{},
	)

	// Create Owner
	hashedPassword, _ := HashPassword("123456")
	owner := &entity.Owner{
		Prefix: "Mr.",
		FirstName: "Poonchub",
		LastName: "Nanawan",
		AdminRole: "Owner",
		Email: "poonchubnanawan310@gmail.com",
		Password: hashedPassword,
	}
	db.FirstOrCreate(owner, &entity.Owner{
		Email: owner.Email,
	})

	// Create Customer
	BirthDay, _ := time.Parse("2006-01-02", "2003-06-02")
	customer := &entity.Customer{
		Prefix: "Mr.",
		FirstName: "Poonchub",
		LastName: "Nanawan",
		Email: "poonchubnanawan320@gmail.com",
		Password: hashedPassword,
		Birthday: BirthDay,
	}
	db.FirstOrCreate(customer, &entity.Customer{
		Email: customer.Email,
	})

	// Create Address
	addresses := []*entity.Address{
		{
			Province: "สกลนคร",
			District: "เมือง",
			Subdistrict: "เหล่าปอแดง",
			ZipCode: "47000",
			AddressDetail: "324/3 บ้านท่าวัด",
			CustomerID: 1,
		},
		{
			Province: "นครราชสีมา",
			District: "เมือง",
			Subdistrict: "สุรนารี",
			ZipCode: "30000",
			AddressDetail: "111 มหาวิทยาลัยเทคโนโลยีสุรนารี หอพักสุรนิเวศ 13 โซนล่าง",
			CustomerID: 1,
		},
	}
	for _, address := range addresses{
		db.FirstOrCreate(address, &entity.Address{
			AddressDetail: address.AddressDetail,
			CustomerID: address.CustomerID,
		})
	}

	// Create Category
	categories := []string{"Notebook", "Monitor", "RAM", "Graphic Card", "CPU", "Mainboard", "Computer"}
	for _, category := range categories {
		path := fmt.Sprintf("images/category/%s.png", category)
			err := createCategory(category, path, 1)
			if err != nil {
				panic(err)
			}
	}

	// Create Brand
	brands := []string{"ASUS", "LENOVO", "T-FORCE", "MSI", "SAMSUNG", "NVIDIA", "INTEL"}
	for _, brand := range brands {
		path := fmt.Sprintf("images/brand/%s.png", brand)
			err := createBrand(brand, path)
			if err != nil {
				panic(err)
			}
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
							Display Size (in.)	24"
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
		{
			ProductName: "VGA(การ์ดจอ) ASUS ROG STRIX GEFORCE RTX 4090 O24G GAMING - 24GB GDDR6X",
			Description: 	`Brands	ASUS
							GPU Series	NVIDIA GeForce RTX™ 40 Series
							GPU Model	GeForce RTX™ 4090
							Memory Size	24GB GDDR6X
							Bus Standard	PCI Express 4.0
							CUDA® Cores	16384
							Memory Interface	384-bit
							Boost Clock	2640 MHz
							Base Clock	2610 MHz
							Memory Clock	21.0 Gbps
							Max Digital Resolution	1366 x 768
							HDMI Port	2 x HDMI 2.1a
							Display Port	-
							DVI Port	N/A
							VGA Port	5 x VGA
							Cooler Fan	3 Fans
							Power Connector	1 x 16-pin
							Power Requirement	1000 Watt
							Dimension (W x H x D)	357.6 x 149.3 x 70.1 mm.
							Warranty	3 Years`,
			PricePerPiece: 93990.00,
			Stock: 10,
			CategoryID: 4,
			BrandID: 1,
		},
		{
			ProductName: "CPU (ซีพียู) INTEL 1700 CORE I5-12400F 2.5GHz 6C 12T",
			Description: 	`Brand	INTEL
							Series	12th Gen Intel® Core™
							Processor Number	Core™ i5-12400F
							Socket Type	Intel® LGA-1700
							Cores/Threads	6 (6P) Cores / 12 Threads
							Base Frequency	2.5 GHz
							Max Turbo Frequency	4.4 GHz
							L2 Cache	7.5 MB
							L3 Cache	18 MB
							Graphics Models	Discrete Graphics Card Required
							64Bit Support	N/A
							CPU Cooler	Yes
							Maximum Turbo Power	65 Watt
							Warranty	3 Years`,
			PricePerPiece: 4290.00,
			Stock: 7,
			CategoryID: 5,
			BrandID: 7,
		},
		{
			ProductName: "MAINBOARD (เมนบอร์ด)(AM5) MSI MEG X670E GODLIKE",
			Description: 	`Brands	MSI
							CPU Support	
							AMD Ryzen 7000 Series
							AMD Ryzen 8000 Series
							AMD Ryzen 9000 Series
							CPU Socket	AMD AM5
							Chipset	AMD X670
							Memory Slots	4 x DIMM
							Memory Type	DDR5
							Max Memory	256GB
							Onboard Audio Chipset	
							Realtek ALC4082 Codec
							ESS ES9280AQ Combo DAC/HPA
							Audio Channels	8-Channel 7.1-Channel USB High Performance Audio
							Expansion Slots	1 x PCIe 5.0 x16 Slot
							Storage	
							4 x M.2 Socket
							8 x SATA3 6Gb/s port(s)
							Rear Panel I/O	1 x Wi-Fi/Bluetooth, 1 x Clear CMOS button, 1 x Optical S/PDIF out, 1 x Flash BIOS button, 1 x Smart button, 1 x 2.5G LAN, 5 x Audio jacks, 1 x 10G SUPER LAN, 7 x USB 10Gbps Type-A, 2 x USB 3.2 Gen 2x2 20Gbps Type-C
							LAN Chipset	Marvell AQC113CS-B1-C 10Gbps LAN
							Intel I225V 2.5Gbps LAN
							LAN Speed	100/1000/2500 Mbps, 100/1000/2500/5000/10000 Mbps
							Dimensions	28.8 x 30.4 cm
							Power Pin	24+8+8 Pin
							Form Factor	E-ATX
							Warranty	3 Years`,
			PricePerPiece: 42900.00,
			Stock: 11,
			CategoryID: 6,
			BrandID: 4,
		},
		{
			ProductName: "JBSINTD5-223 INTEL I9-14900KS 6.2GHz 24C/32T / Z790 / ONBOARD / 96GB DDR5 5600MHz / M.2 1TB / 1300W (80+PLATINUM) / CS360",
			Description: 	`CPU	Intel® CORE I9-14900KS 6.2GHz 24C/32T
							Mainboard	GIGABYTE Z790 AORUS MASTER DDR5 (REV.1.0)
							Graphic card	ONBOARD Intel® UHD Graphics 770 (อัพเกรดการ์ดจอติดต่อ ADMIN)
							Memory	G.SKILL TRIDENT Z5 NEO RGB 96GB (48x2) DDR5 5600MHz
							Storage	M.2 WD BLACK SN770 1TB (5,150MB/s)
							Power Supply	MSI MEG AI1300P PCIE5 1300W (80+PLATINUM)
							Case	NZXT H9 ELITE (MATTE BLACK)(CM-H91EB-01)(ATX) | (เลือกเคสติดต่อ ADMIN)
							Cooling System	NZXT KRAKEN ELITE 360 RGB BLACK
							Warranty	3 Years (ยกเว้น CASE ประกัน 1 ปี)`,
			PricePerPiece: 96990.00,
			Stock: 20,
			CategoryID: 7,
			BrandID: 7,
		},
	}
	for _, product := range products{
		db.FirstOrCreate(product, &entity.Product{
			ProductName: product.ProductName,
		})
	}

	// Create Image Product
	for i:=uint(1); i<=7 ;i++{
		dir := fmt.Sprintf("images/product/product%d", i)
		count := countFilesInDir(dir)
		for j:=1 ; j<=count ; j++ {
			filePath := fmt.Sprintf("images/product/product%d/p0%d.jpg", i, j)
			err := createImage(filePath, i)
			if err != nil {
				panic(err)
			}
		}
	}
}

func createCategory(name string, filePath string, id uint) error {
    category := entity.Category{CategoryName: name, ImagePath: filePath, OwnerID: id}

	if err := db.Where("category_name = ?", &category.CategoryName).FirstOrCreate(&category).Error; err != nil {
        return err
    }
    return nil
}

func createBrand(name string, filePath string) error {
    brand := entity.Brand{BrandName: name, ImagePath: filePath}

	if err := db.Where("brand_name = ?", &brand.BrandName).FirstOrCreate(&brand).Error; err != nil {
        return err
    }
    return nil
}

func createImage(filePath string, id uint) error {

    image := entity.Image{FilePath: filePath, ProductID: id}

	if err := db.Where("file_path = ?", &image.FilePath).FirstOrCreate(&image).Error; err != nil {
        return err
    }
    return nil
}

func countFilesInDir(dir string) (int) {
    files, err := ioutil.ReadDir(dir)
    if err != nil {
        return 0
    }

    fileCount := 0
    for _, file := range files {
        if !file.IsDir() {
            fileCount++
        }
    }

    return fileCount
}