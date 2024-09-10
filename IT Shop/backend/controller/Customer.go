package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /customers
func ListCustomers(c *gin.Context) {
	var customers []entity.Customer

	db := config.DB()

	db.Find(&customers)

	c.JSON(http.StatusOK, &customers)
}

// GET /customer/:id
func GetCustomerByID(c *gin.Context) {
	ID := c.Param("id")
	var customer entity.Customer

	db := config.DB()
	results := db.First(&customer, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if customer.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// PATCH /orderItem
func UpdateCustomer(c *gin.Context) {
	ID := c.Param("id")

	var customer entity.Customer

	db := config.DB()
	result := db.First(&customer, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&customer)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}