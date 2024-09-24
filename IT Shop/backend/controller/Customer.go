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

// PUT /customer/:id
func UpdateCustomerByID(c *gin.Context) {
	var customer entity.Customer
	id := c.Param("id")
	db := config.DB()

	// ตรวจสอบว่า customer มีอยู่จริง
	if err := db.First(&customer, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	// Binding ข้อมูลที่ต้องการอัปเดตจาก form
	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// บันทึกการอัปเดต
	if err := db.Save(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update customer"})
		return
	}

	c.JSON(http.StatusOK, customer)
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
		LastName:  customer.LastName,
		Email:     customer.Email,
		Password:  hashedPassword,
		PhoneNumber: customer.PhoneNumber,
		Birthday:  customer.Birthday,
		GenderID:  customer.GenderID,
		Gender:    gender,
	}

	if err := db.Preload("Address.Custome").FirstOrCreate(&cus, &entity.Customer{Email: cus.Email}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": cus})
}

// PATCH /orderItem
func UploadProfilePicture(c *gin.Context) {
	db := config.DB()

	// รับ customer ID จากข้อมูลในฟอร์ม
	customerID, err := strconv.ParseUint(c.PostForm("customerID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	// รับไฟล์จากฟอร์ม
	file, err := c.FormFile("profile")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	// เปิดไฟล์เพื่อตรวจสอบ MIME type
	openedFile, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer openedFile.Close()

	// ตรวจสอบ MIME type
	buffer := make([]byte, 512)
	_, err = openedFile.Read(buffer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read file"})
		return
	}

	mimeType := http.DetectContentType(buffer)
	if mimeType != "image/jpeg" && mimeType != "image/png" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only JPEG and PNG images are allowed"})
		return
	}

	// รับนามสกุลไฟล์จากไฟล์ที่อัพโหลด
	ext := filepath.Ext(file.Filename)
	if ext == "" {
		ext = ".png" // ตั้งค่าเริ่มต้นเป็น .png หากไม่มีนามสกุลไฟล์
	}

	// สร้างโฟลเดอร์ย่อยสำหรับภาพโปรไฟล์
	subfolder := "profile"
	fileName := fmt.Sprintf("customer_id%02d%s", customerID, ext) // ปรับชื่อไฟล์ให้เหมาะสม
	filePath := filepath.Join("images", subfolder, "customer", fileName)

	// สร้างไดเรกทอรีหากยังไม่มี
	err = os.MkdirAll(filepath.Join("images", subfolder, "customer"), os.ModePerm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// อัพเดตเส้นทางโปรไฟล์ของลูกค้าในฐานข้อมูล
	var customer entity.Customer
	if err := db.First(&customer, customerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	// ลบรูปโปรไฟล์เดิมถ้ามี
	if customer.ProfilePath != "" {
		if err := os.Remove(customer.ProfilePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old profile picture"})
			return
		}
	}

	// บันทึกไฟล์ที่อัพโหลด
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// อัปเดตเส้นทางโปรไฟล์ใหม่ในฐานข้อมูล
	customer.ProfilePath = filePath
	if err := db.Save(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update customer profile path"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Profile picture uploaded successfully", "data": customer})
}
