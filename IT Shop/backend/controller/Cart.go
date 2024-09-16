package controller


import (
	
	"net/http"
	

	// "thiradet/config"
	"main/config"
	"main/entity"

	"github.com/gin-gonic/gin"
	
	
)




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



func UpdateProductFromCart(c *gin.Context) {
	ID := c.Param("productid")

	var product entity.Product

	db := config.DB()
	result := db.First(&product, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&product)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}