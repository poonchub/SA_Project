package controller


import (
	"fmt"
	"log"
	"net/http"
	

	// "thiradet/config"
	"main/config"
	"main/entity"

	"github.com/gin-gonic/gin"
	
	"gorm.io/gorm"
)

func CreateUser(db *gorm.DB, customer *entity.Customer) {
	//create                       ตัวแทนdataใช้ address ข้อมูล

	// how to use create
	// 	birthday, _ := time.Parse("2006-01-02", "1990-01-01")
	// 	customer :=&entity.Customer{

	// 	Prefix :"mr",
	// 	FirstName :"eight",
	//     LastName: "six",
	// 	Email :"2@gmail.com",
	// 	Password :"1235",
	//     BirtDay :birthday ,

	// }

	// 	controller.CreateUser(config.DB(),customer)

	result := db.Create(customer)
	if result.Error != nil {
		log.Fatalf("Error creating book: %v", result.Error)
	}
	fmt.Println("Customer created successfully")

}
func GetUser(c *gin.Context) { //เหลือ ถ้าใส่เกินจำนวน
	db := config.DB()
	var customers []entity.Customer // ตัวแปรรับข้อมูล
	results := db.Find(&customers)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, customers)
}


// func UpdateCart(c *gin.Context){

// 	var cart entity.Cart
// 	db:=config.DB()
// 	CartID := c.Param("id")
// 	result := db.First(&cart, CartID)

// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&cart); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
// 		return
// 	}
// 	//เช็ก stock
// 	// var product entity.Product
// 	// if cart.Quantity > product.Stock {
// 	// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Over stock"})
// 	// 	return
// 	// }

// 	if result.Error != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
// 		return
// 	}
// 	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
// }

// สร้างฟังก์ชัน uplate cart ตาม id
// สร้างฟังก์ชัน update cart ตาม id
func UpdateCart(c *gin.Context) {
	var cart entity.Cart
	db := config.DB()
	CartID := c.Param("id")
	result := db.First(&cart, CartID)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	//ถ้าจำนวนสินค้ามากกว่า stock ไม่อนุญาต อนุญาตให้ลดจำนวนแทน

	if err := c.ShouldBindJSON(&cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	if result := db.Save(&cart); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

func DelteProductCart(c *gin.Context) {
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM carts WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}

type ProductStock struct {
	Stock uint
}

func CreateCartByChat(c *gin.Context) {
	var cart entity.Cart
    id := c.Param("id")
	// Bind JSON เข้าตัวแปร cart
	if err := c.ShouldBindJSON(&cart); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ค้นหา customer ด้วย ID
	var customer entity.Customer
	result := db.First(&customer, id)
	if result.Error != nil || customer.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	// ค้นหา product ด้วย ID
	var product entity.Product
	result = db.First(&product, cart.ProductID)
	if result.Error != nil || product.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// เช็ค stock
	if cart.Quantity > product.Stock {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Over stock"})
		return
	}

	// ค้นหา cart ที่มี customerId และ productId เดียวกัน
	var existingCart entity.Cart
	result = db.Where("customer_id = ? AND product_id = ?", id, cart.ProductID).First(&existingCart)
	if result.RowsAffected > 0 {
		// ถ้ามี cart เดียวกันอยู่แล้ว เพิ่มจำนวน Quantity
		existingCart.Quantity += cart.Quantity
		if existingCart.Quantity > product.Stock {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Over stock after adding to cart"})
			return
		}
		if err := db.Save(&existingCart).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Cart updated successfully", "data": existingCart})
	} else {
		// ถ้าไม่มี cart เดียวกัน สร้าง cart ใหม่
		newCart := entity.Cart{
			Quantity:   cart.Quantity,
			CustomerID: cart.CustomerID,
			ProductID:  cart.ProductID,
			Customer:   customer,
			Product:    product,
		}
		if err := db.Create(&newCart).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, gin.H{"message": "Created Cart successfully", "data": newCart})
	}
}
func GetAllCart(c *gin.Context) {
	var carts []entity.Cart

	db := config.DB()
	// ใช้ Preload เพื่อดึงข้อมูลความสัมพันธ์ และ Find เพื่อดึงข้อมูลทั้งหมด
	results := db.Preload("Picture").Preload("Customer").Preload("Product").Find(&carts)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// ส่งคืนข้อมูล carts ทั้งหมดในรูปแบบ JSON
	c.JSON(http.StatusOK, carts)
}

// สร้างฟังก์ชันดึงข้อมล cart ตาม customerId แสดงข้อมูลทั้งหมด
func GetCartByCustomer(c *gin.Context) {
	db := config.DB()
	var cart []entity.Cart

	// ใช้ Preload เพื่อดึงข้อมูล Customer, Product และ Picture ที่เกี่ยวข้อง
	if err := db.Preload("Customer").
		Preload("Product").
		Preload("Product.Image"). // ดึงข้อมูล Picture ที่เกี่ยวข้องกับ Product
		Where("customer_id = ?", c.Param("customerId")).
		Find(&cart).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": cart})
}


// func GetAllImages(c *gin.Context) {
// 	db := config.DB()
// 	var images []entity.Picture
// 	result := db.Preload("Product").Find(&images)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	for i := range images {
// 		images[i].File = fmt.Sprintf("http://localhost:8000/uploads/%s", images[i].File)
// 	}

// 	c.JSON(http.StatusOK, images)
// }
// func GetImage(c *gin.Context) {
// 	db := config.DB()
// 	id := c.Param("id")
// 	var image entity.Picture
// 	result := db.First(&image, id)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	if err := db.Preload("Customer").Preload("Product").Where("customer_id = ?", c.Param("customerId")).Find(&image).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	image.File = fmt.Sprintf("http://localhost:8000/uploads/%s", image.File)
// 	c.JSON(http.StatusOK, image)
// }


// func GetProducts(c *gin.Context) {
// 	db := config.DB()
// 	var products []entity.Product
// 	result := db.Preload("Pictures").Find(&products)
// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, products)
// }