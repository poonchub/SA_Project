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

	db.Preload("Gender").Find(&customers)

	c.JSON(http.StatusOK, &customers)
}

// GET /customer/:id
func GetCustomerByID(c *gin.Context) {
	ID := c.Param("id")
	var customer entity.Customer

	db := config.DB()
	results := db.Preload("Gender").First(&customer, ID)
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
func UpdateCustomerByID(c *gin.Context) {
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

// POST /customer
func CreateCustomer(c *gin.Context) {
	var customer entity.Customer

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var gender entity.Gender
	db.First(&gender, customer.GenderID)
	if gender.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Gender not found"})
		return
	}

	hashedPassword, _ := config.HashPassword(customer.Password)
	cus := entity.Customer{
		FirstName: customer.FirstName,
		LastName: customer.LastName,
		Email: customer.Email,
		Password: hashedPassword,
		Birthday: customer.Birthday,
		GenderID: customer.GenderID,
		Gender: gender,
	}

	if err := db.Preload("Address.Custome").FirstOrCreate(&cus, &entity.Customer{Email: cus.Email}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": cus})
}