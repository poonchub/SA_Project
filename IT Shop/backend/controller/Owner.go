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

func GetOwners(c *gin.Context){
	var owners []entity.Owner

	db := config.DB()

	db.Find(&owners)

	c.JSON(http.StatusOK,&owners)

}

func GetOwnerByID(c *gin.Context){
	var owner entity.Owner

	id := c.Param("id")

	db := config.DB()

	if err := db.First(&owner, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}	

	c.JSON(http.StatusOK, owner)
}


func GetAllOrderforOwner(c *gin.Context) {
	var orders []entity.Order

	db := config.DB()
	// ใช้ Preload เพื่อดึงข้อมูลความสัมพันธ์ และ Find เพื่อดึงข้อมูลทั้งหมด
	results := db.Find(&orders)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// ส่งคืนข้อมูล carts ทั้งหมดในรูปแบบ JSON
	c.JSON(http.StatusOK, orders)
}


func ConfirmOrder(c *gin.Context){
	var orders entity.Order

	orderID := c.Param("orderId")

	db := config.DB()
	result := db.First(&orders, orderID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&orders); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&orders)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}
func GetPaymentbyID(c *gin.Context) {
	var Payments []entity.Payment
    paymentID := c.Param("id")
	db := config.DB()

	db.Preload("Order").Preload("Customer").Where("order_id = ?",paymentID).Find(&Payments)

	c.JSON(http.StatusOK, &Payments)
}

func CreateOwner(c *gin.Context) {
	db := config.DB()

	var owner entity.Owner

	// ตรวจสอบและบันทึกข้อมูล JSON ของ owner
	if err := c.ShouldBindJSON(&owner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashedPassword, err := config.HashPassword(owner.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	own := entity.Owner{
		FirstName:  owner.FirstName,
		LastName:   owner.LastName,
		Email:      owner.Email,
		Password:   hashedPassword,
		ProfilePath: owner.ProfilePath,
		
		GenderID:   owner.GenderID,
		Gender:     owner.Gender,
	}

	// บันทึก owner ลงในฐานข้อมูล
	if err := db.FirstOrCreate(&own, &entity.Owner{Email: own.Email}).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งกลับ owner พร้อม ID ที่เพิ่งสร้าง
	c.JSON(http.StatusCreated, gin.H{"data": own})
}


func UpdateOwner(c *gin.Context) {
	var owner entity.Owner
	id := c.Param("id")
	db := config.DB()

	// ตรวจสอบว่าเจ้าของมีอยู่ในฐานข้อมูลหรือไม่
	if err := db.First(&owner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	var updatedOwner entity.Owner
	if err := c.ShouldBindJSON(&updatedOwner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}


	// อัปเดตข้อมูลเจ้าของ
	if err := db.Model(&owner).Updates(updatedOwner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update owner"})
		return
	}

	// ส่งกลับเจ้าของที่อัปเดต
	c.JSON(http.StatusOK, gin.H{"message": "Owner updated successfully", "data": owner})
}


func DeleteOwner(c *gin.Context) {
    id := c.Param("id") // รับค่า id จาก URL

    db := config.DB()

    // ลบเจ้าของจากฐานข้อมูล
    if tx := db.Where("id = ?", id).Delete(&entity.Owner{}); tx.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func UploadProfileOwner(c *gin.Context) {
	db := config.DB()

	// รับ customer ID จากข้อมูลในฟอร์ม
	ownerID, err := strconv.ParseUint(c.PostForm("ownerID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid owner ID"})
		return
	}

	// รับไฟล์จากฟอร์ม
	file, err := c.FormFile("owner-profile")
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
	fileName := fmt.Sprintf("owner_id%02d%s", ownerID, ext) // ปรับชื่อไฟล์ให้เหมาะสม
	filePath := filepath.Join("images", subfolder, "owner", fileName)

	// สร้างไดเรกทอรีหากยังไม่มี
	err = os.MkdirAll(filepath.Join("images", subfolder, "owner"), os.ModePerm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// อัพเดตเส้นทางโปรไฟล์ของลูกค้าในฐานข้อมูล
	var owner entity.Owner
	if err := db.First(&owner, ownerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	// ลบรูปโปรไฟล์เดิมถ้ามี
	if owner.ProfilePath != "" {
		if err := os.Remove(owner.ProfilePath); err != nil {
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
	owner.ProfilePath = filePath
	if err := db.Save(&owner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update customer profile path"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Profile picture uploaded successfully", "data": owner})
}

func UpdateProfileOwner(c *gin.Context) {
	db := config.DB()

	// รับ owner ID จากข้อมูลในฟอร์ม
	ownerID, err := strconv.ParseUint(c.PostForm("ownerID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid owner ID"})
		return
	}

	// ค้นหา owner จากฐานข้อมูล
	var owner entity.Owner
	if err := db.First(&owner, ownerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	// รับไฟล์จากฟอร์ม (ตรวจสอบว่าไฟล์มีการอัพโหลดหรือไม่)
	file, err := c.FormFile("owner-profile")
	if err == nil {
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
		fileName := fmt.Sprintf("owner_id%02d%s", ownerID, ext) // ปรับชื่อไฟล์ให้เหมาะสม
		filePath := filepath.Join("images", subfolder, "owner", fileName)

		// สร้างไดเรกทอรีหากยังไม่มี
		err = os.MkdirAll(filepath.Join("images", subfolder, "owner"), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		// ลบรูปโปรไฟล์เดิมถ้ามี
		if owner.ProfilePath != "" {
			if err := os.Remove(owner.ProfilePath); err != nil {
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
		owner.ProfilePath = filePath
	}

	// บันทึกข้อมูลทั้งหมดในฐานข้อมูล
	if err := db.Save(&owner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update owner profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Owner profile updated successfully", "data": owner})
}




