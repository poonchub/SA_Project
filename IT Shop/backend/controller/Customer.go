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
		LastName:  customer.LastName,
		Email:     customer.Email,
		Password:  hashedPassword,
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

	// สร้างโฟลเดอร์ย่อยสำหรับภาพโปรไฟล์
	subfolder := "profile"
	fileName := fmt.Sprintf("customer_id%02d.jpg", customerID) // ปรับชื่อไฟล์ให้เหมาะสม
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
