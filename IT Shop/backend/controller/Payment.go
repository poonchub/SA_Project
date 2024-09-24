package controller

import (
	"fmt"
	"main/config"
	"main/entity"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListPayment(c *gin.Context) {
	var Payments []entity.Payment

	db := config.DB()

	db.Preload("Order").Preload("Customer").Find(&Payments)

	c.JSON(http.StatusOK, &Payments)
}

func CreatePayment(c *gin.Context) {
	// var payment entity.Payment
	// if err := c.ShouldBindJSON(&payment); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	db := config.DB()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	files := form.File["slip"]
	customerID, _ := strconv.ParseUint(c.PostForm("customerID"), 10, 32)
	orderID, _ := strconv.ParseUint(c.PostForm("orderID"), 10, 32)

	for _, file := range files {
		subfolder := "slip"
		fileName := filepath.Base(file.Filename)
		filePath := filepath.Join("images", "payment", subfolder, fileName)

		// สร้างตำแหน่งโฟลเดอร์ที่จะเก็บถ้ายังไม่มี
		err = os.MkdirAll(filepath.Join("images", "payment", subfolder), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		var customer entity.Customer
		db.First(&customer, customerID)
		if customer.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
			return
		}

		var order entity.Order
		db.First(&order, orderID)
		if order.ID == 0 {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}

		paym := entity.Payment{
			Amount:     *order.TotalPrice,
			SlipPath:   filePath,
			CustomerID: customer.ID,
			Customer:   customer,
			OrderID:    order.ID,
			Order:      order,
		}
		if err := db.Create(&paym).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// if err := db.Preload("Customer").Preload("Order").Create(&paym).Error; err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		// 	return
		// }

		// อัพเดตสถานะของ Order เป็น "paid"
		if err := db.Model(&order).Update("status", "รอการตรวจสอบ").Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": paym})
	}

	// c.JSON(http.StatusCreated, gin.H{"message": "Files uploaded successfully"})

}

func UpdatePaymentSlipByOrderID(c *gin.Context) {
	db := config.DB()

	// รับ ID ของ Order ที่ต้องการอัปเดตจาก URL parameter
	orderIDStr := c.Param("orderID") // เปลี่ยนเป็น orderID
	fmt.Println("Received orderID:", orderIDStr)

	orderID, err := strconv.ParseUint(orderIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	// ค้นหา Order ที่ต้องการอัปเดต
	var order entity.Order
	if err := db.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// ค้นหา Payment ที่เกี่ยวข้องกับ OrderID
	var payment entity.Payment
	if err := db.Where("order_id = ?", orderID).First(&payment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Payment not found for the given order ID"})
		return
	}

	// ตรวจสอบว่ามีการส่งไฟล์สลิปใหม่หรือไม่
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	files := form.File["SlipPath"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No slip file provided"})
		return
	}

	// รับไฟล์แรก (สมมติว่าอัพโหลดเพียงไฟล์เดียว)
	file := files[0]

	// สร้างเส้นทางโฟลเดอร์ใหม่
	subfolder := "slip"
	fileName := filepath.Base(file.Filename)
	newFilePath := filepath.Join("images", "payment", subfolder, fileName)

	// สร้างตำแหน่งโฟลเดอร์ถ้ายังไม่มี
	err = os.MkdirAll(filepath.Join("images", "payment", subfolder), os.ModePerm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// บันทึกไฟล์ที่อัพโหลดลงในตำแหน่งที่กำหนด
	if err := c.SaveUploadedFile(file, newFilePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// อัปเดตเส้นทางสลิปในฐานข้อมูล
	payment.SlipPath = newFilePath
	if err := db.Save(&payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update payment slip"})
		return
	}

	// อัปเดตสถานะของ Order
	order.Status = "รอการตรวจสอบ"
	if err := db.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Payment slip updated successfully", "data": payment})
}
