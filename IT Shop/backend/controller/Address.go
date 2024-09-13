package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /addresses
func ListAddresses(c *gin.Context) {
	var addresses []entity.Address

	db := config.DB()

	db.Preload("Customer").Find(&addresses)

	c.JSON(http.StatusOK, &addresses)
}

// GET /address/:id
func GetAddressByID(c *gin.Context) {
	ID := c.Param("id")
	var address entity.Address

	db := config.DB()
	results := db.Preload("Customer").First(&address, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if address.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, address)
}

// GET /addresses/:id
func GetAddressByCustomerID(c *gin.Context) {
	ID := c.Param("id")
	var addresses []entity.Address

	db := config.DB()
	results := db.Preload("Customer").Find(&addresses, "customer_id=?", ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, addresses)
}

// PATCH /address
func UpdateAddress(c *gin.Context) {
	ID := c.Param("id")

	var address entity.Address

	db := config.DB()
	result := db.First(&address, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&address); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&address)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// GET /addresseOrder/:id
func GetAddressByOrderID(c *gin.Context) {
	orderID := c.Param("id")
	var order entity.Order

	db := config.DB()

	// ดึงข้อมูล Order โดยใช้ OrderID
	if err := db.Preload("Address").First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// ตรวจสอบว่า AddressID มีค่าและดึงข้อมูล Address
	var address entity.Address
	if order.AddressID != 0 {
		if err := db.First(&address, order.AddressID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Address not found"})
			return
		}
		c.JSON(http.StatusOK, address)
	} else {
		c.JSON(http.StatusNotFound, gin.H{"error": "AddressID is empty in the order"})
	}
}
