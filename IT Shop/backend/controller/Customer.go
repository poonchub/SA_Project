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