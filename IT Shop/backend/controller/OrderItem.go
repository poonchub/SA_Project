package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /orderItems
func ListOrderItems(c *gin.Context) {
	var orderItems []entity.OrderItem

	db := config.DB()

	db.Preload("Order").Preload("Product").Find(&orderItems)

	c.JSON(http.StatusOK, &orderItems)
}

// GET /orderItem/:id
func GetOrderItemByID(c *gin.Context) {
	ID := c.Param("id")
	var orderItem entity.OrderItem

	db := config.DB()
	results := db.Preload("Order").Preload("Product").First(&orderItem, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if orderItem.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, orderItem)
}

// POST /orderItem
func CreateOrderItem(c *gin.Context) {
	var orderItem entity.OrderItem

	if err := c.ShouldBindJSON(&orderItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var order entity.Order
	db.First(&order, orderItem.OrderID)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		return
	}

	var product entity.Product
	db.First(&product, orderItem.ProductID)
	if product.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
		return
	}

	odItem := entity.OrderItem{
		Quantity: orderItem.Quantity,
		Price: orderItem.Price,
		OrderID: orderItem.OrderID,
		Order: order,
		ProductID: orderItem.ProductID,
		Product: product,
	}

	if err := db.Preload("Address.Customer").Create(&odItem).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": odItem})
}

// PATCH /orderItem
func UpdateOrderItem(c *gin.Context) {
	ID := c.Param("id")

	var orderItem entity.OrderItem

	db := config.DB()
	result := db.First(&orderItem, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&orderItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&orderItem)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}