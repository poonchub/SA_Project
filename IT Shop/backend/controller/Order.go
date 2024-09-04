package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /orders
func ListOrders(c *gin.Context) {
	var orders []entity.Order

	db := config.DB()

	db.Preload("Customer").Preload("Address.Customer").Find(&orders)

	c.JSON(http.StatusOK, &orders)
}

// GET /order/:id
func GetOrderByID(c *gin.Context) {
	ID := c.Param("id")
	var order entity.Order

	db := config.DB()
	results := db.Preload("Customer").Preload("Address.Customer").First(&order, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if order.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, order)
}

// GET /orders/:id
func GetOrderByCustomerID(c *gin.Context) {
	ID := c.Param("id")
	var orders []entity.Order

	db := config.DB()
	results := db.Preload("Customer").Preload("Address.Customer").Find(&orders, "customer_id=?", ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// POST /order
func CreateOrder(c *gin.Context) {
	var order entity.Order

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var customer entity.Customer
	db.First(&customer, order.CustomerID)
	if customer.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		return
	}

	var address entity.Address
	db.First(&address, order.AddressID)
	if address.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
		return
	}

	od := entity.Order{
		OrderDate: order.OrderDate,
		TotalPrice: order.TotalPrice,
		Status: order.Status,
		CustomerID: order.CustomerID,
		Customer: customer,
		AddressID: order.AddressID,
		Address: address,
	}

	if err := db.Preload("Address.Custome").Create(&od).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": od})
}

// PATCH /order
func UpdateOrder(c *gin.Context) {
	ID := c.Param("id")

	var order entity.Order

	db := config.DB()
	result := db.First(&order, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&order)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}