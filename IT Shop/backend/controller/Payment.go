package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListPayment(c *gin.Context) {
	var Payments []entity.Payment

	db := config.DB()

	db.Preload("Order").Preload("Customer").Find(&Payments)

	c.JSON(http.StatusOK, &Payments)
}

func CreatePayment(c *gin.Context) {
	var payment entity.Payment

	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Handle file upload
	file, _ := c.FormFile("SlipPath")
	if file != nil {
		// Save the file to a specific location
		filePath := "../image/payment/slip/" + file.Filename
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
			return
		}
		// Save file path in the payment record
		payment.SlipPath = filePath
	}

	db := config.DB()

	var customer entity.Customer
	db.First(&customer, payment.CustomerID)
	if customer.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		return
	}

	var order entity.Order
	db.First(&order, payment.OrderID)
	if order.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
		return
	}

	paym := entity.Payment{
		PaymentDate:   payment.PaymentDate,
		PaymentMethod: payment.PaymentMethod,
		Amount:        payment.Amount,
		SlipPath:      payment.SlipPath,
		CustomerID:    payment.CustomerID,
		Customer:      customer,
		OrderID:       payment.OrderID,
		Order:         payment.Order,
	}

	if err := db.Preload("Customer").Preload("Order").Create(&paym).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update order status to "paid"
	ID := c.Param("id")

	result := db.First(&order, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}
	db.Model(&order).Update("status", "paid")
	// db.Save(&product{ID: 1, Status: "Paid"})

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": paym})
}
