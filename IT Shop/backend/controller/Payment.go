package controller

import (
	"main/config"
	"main/entity"
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func ListPayment(c *gin.Context) {
	var Payments []entity.Payment

	db := config.DB()

	db.Preload("Order").Preload("Customer").Find(&Payments)

	c.JSON(http.StatusOK, &Payments)
}

// func CreatePayment(c *gin.Context) {
// 	var payment entity.Payment

// 	if err := c.ShouldBindJSON(&payment); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Handle file upload
// 	file, _ := c.FormFile("SlipPath")
// 	if file != nil {
// 		// Save the file to a specific location
// 		filePath := "../image/payment/slip/" + file.Filename
// 		if err := c.SaveUploadedFile(file, filePath); err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
// 			return
// 		}
// 		// Save file path in the payment record
// 		payment.SlipPath = filePath
// 	}

// 	db := config.DB()

// 	var customer entity.Customer
// 	db.First(&customer, payment.CustomerID)
// 	if customer.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
// 		return
// 	}

// 	var order entity.Order
// 	db.First(&order, payment.OrderID)
// 	if order.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "address not found"})
// 		return
// 	}

// 	paym := entity.Payment{
// 		PaymentDate:   payment.PaymentDate,
// 		PaymentMethod: payment.PaymentMethod,
// 		Amount:        payment.Amount,
// 		SlipPath:      payment.SlipPath,
// 		CustomerID:    payment.CustomerID,
// 		Customer:      customer,
// 		OrderID:       payment.OrderID,
// 		Order:         payment.Order,
// 	}

// 	if err := db.Preload("Customer").Preload("Order").Create(&paym).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Update order status to "paid"
// 	ID := c.Param("id")

// 	result := db.First(&order, ID)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
// 		return
// 	}
// 	db.Model(&order).Update("status", "paid")
// 	// db.Save(&product{ID: 1, Status: "Paid"})

// 	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": paym})
// }

// func CreatePayment(c *gin.Context) {
// 	var payment entity.Payment

// 	// ดึงข้อมูลจาก form-data
// 	payment.PaymentMethod = c.PostForm("PaymentMethod")

// 	// ดึงและแปลงค่าจาก form-data เป็น float64 สำหรับ Amount
// 	amountStr := c.PostForm("Amount")
// 	amount, err := strconv.ParseFloat(amountStr, 64) // แปลงจาก string เป็น float64
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid amount value"})
// 		return
// 	}
// 	payment.Amount = amount

// 	// ดึง CustomerID และ OrderID จาก form-data
// 	customerIDStr := c.PostForm("CustomerID")
// 	customerID, err := strconv.ParseUint(customerIDStr, 10, 64)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid CustomerID"})
// 		return
// 	}
// 	payment.CustomerID = uint(customerID)

// 	orderIDStr := c.PostForm("OrderID")
// 	orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OrderID"})
// 		return
// 	}
// 	payment.OrderID = uint(orderID)

// 	// Handle file upload
// 	file, _ := c.FormFile("SlipPath")
// 	if file != nil {
// 		// Save the file to a specific location
// 		filePath := "../image/payment/slip/" + file.Filename
// 		if err := c.SaveUploadedFile(file, filePath); err != nil {
// 			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
// 			return
// 		}
// 		// Save file path in the payment record
// 		payment.SlipPath = filePath
// 	}

// 	db := config.DB()

// 	// ตรวจสอบ Customer
// 	var customer entity.Customer
// 	db.First(&customer, payment.CustomerID)
// 	if customer.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
// 		return
// 	}

// 	// ตรวจสอบ Order
// 	var order entity.Order
// 	db.First(&order, payment.OrderID)
// 	if order.ID == 0 {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
// 		return
// 	}

// 	paym := entity.Payment{
// 		PaymentDate:   payment.PaymentDate,
// 		PaymentMethod: payment.PaymentMethod,
// 		Amount:        payment.Amount,
// 		SlipPath:      payment.SlipPath,
// 		CustomerID:    payment.CustomerID,
// 		Customer:      customer,
// 		OrderID:       payment.OrderID,
// 		Order:         payment.Order,
// 	}

// 	if err := db.Preload("Customer").Preload("Order").Create(&paym).Error; err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// อัปเดตสถานะ order เป็น "paid"
// 	db.Model(&order).Update("status", "paid")

// 	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": paym})
// }

func CreatePayment(c *gin.Context) {
	var payment entity.Payment

	// รับข้อมูล JSON ที่ไม่รวมไฟล์
	if err := c.ShouldBindJSON(&payment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// ตรวจสอบและค้นหา Customer
	var customer entity.Customer
	if err := db.First(&customer, payment.CustomerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		return
	}

	// ตรวจสอบและค้นหา Order
	var order entity.Order
	if err := db.First(&order, payment.OrderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
		return
	}

	// ตั้งค่า Amount ของการชำระเงินเป็น total_price ของ Order
	payment.Amount = float64(*order.TotalPrice)

	// เริ่มต้น path ของไฟล์เป็นค่าว่าง
	var filePath string

	// ตรวจสอบและอัพโหลดไฟล์ถ้ามี
	if file, err := c.FormFile("SlipPath"); err == nil {
		// สร้าง path สำหรับการเก็บไฟล์
		filePath = filepath.Join("image/payment/slip", file.Filename)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload file"})
			return
		}
	}

	// บันทึกข้อมูลการชำระเงิน
	paym := entity.Payment{
		PaymentDate:   payment.PaymentDate,
		PaymentMethod: payment.PaymentMethod,
		Amount:        payment.Amount, // ใช้ Amount ที่ตั้งค่า
		SlipPath:      filePath,       // ใช้ path ของไฟล์ที่อัพโหลด
		CustomerID:    payment.CustomerID,
		Customer:      customer,
		OrderID:       payment.OrderID,
		Order:         order,
	}

	if err := db.Preload("Customer").Preload("Order").Create(&paym).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัพเดตสถานะของ Order เป็น "paid"
	if err := db.Model(&order).Update("status", "paid").Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	// ส่ง response พร้อมข้อมูลการชำระเงิน
	c.JSON(http.StatusCreated, gin.H{"message": "Payment created successfully", "data": paym})
}
