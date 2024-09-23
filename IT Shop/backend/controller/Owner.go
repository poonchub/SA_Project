package controller

import (
	"main/config"
	"main/entity"
	"net/http"
	"os"
	"path/filepath"

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

	// บันทึก owner ลงในฐานข้อมูล
	if err := db.Create(&owner).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// ส่งกลับ owner พร้อม ID ที่เพิ่งสร้าง
	c.JSON(http.StatusCreated, gin.H{"data": owner})
}



func UpdateOwner(c *gin.Context) {
	var owner entity.Owner
	id := c.Param("id")
	db := config.DB()


	if err := db.First(&owner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	var updatedOwner entity.Owner
	if err := c.ShouldBindJSON(&updatedOwner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := db.Model(&owner).Updates(updatedOwner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update owner"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Owner updated successfully"})
}

func DeleteOwner(c *gin.Context) {
    id := c.Param("id") // รับค่า id จาก URL
    
    db := config.DB()

    if tx := db.Where("id = ?", id).Delete(&entity.Owner{}); tx.RowsAffected == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Owner not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}


func CreateOwnerImage(c *gin.Context) {
	db := config.DB()
	ownerID := c.Param("id")

	var owner entity.Owner

	// ค้นหา owner จาก ID
	if err := db.First(&owner, ownerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Owner not found"})
		return
	}

	// รับไฟล์รูปภาพจาก form
	file, err := c.FormFile("profile_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image not found"})
		return
	}

	fileName := filepath.Base(file.Filename)
	filePath := filepath.Join("images", "profile", "owner", fileName)

	// สร้างโฟลเดอร์ถ้ายังไม่มี
	if err := os.MkdirAll(filepath.Join("images", "profile", "owner"), os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// บันทึกไฟล์รูปภาพ
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	// อัปเดตพาธรูปภาพใน owner
	owner.ProfilePath = filePath
	if err := db.Save(&owner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update owner"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": owner})
}

func UpdateOwnerImage(c *gin.Context) {
	db := config.DB()
	var owner entity.Owner

	// รับค่า id ของ owner ที่จะอัปเดต
	id := c.Param("id")
	if err := db.First(&owner, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Owner not found"})
		return
	}

	// ตรวจสอบว่ามีการอัปโหลดรูปใหม่หรือไม่
	file, err := c.FormFile("profile_image")
	if err == nil {
		// ลบรูปเก่าออก ถ้ามีรูปเก่า
		if owner.ProfilePath != "" {
			if err := os.Remove(owner.ProfilePath); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old profile image"})
				return
			}
		}

		// บันทึกรูปภาพใหม่
		fileName := filepath.Base(file.Filename)
		filePath := filepath.Join("images", "profile", "owner", fileName)

		if err := os.MkdirAll(filepath.Join("images", "profile", "owner"), os.ModePerm); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save new profile image"})
			return
		}

		// อัปเดตพาธรูปใหม่ใน ProfilePath
		owner.ProfilePath = filePath
	}

	// รับข้อมูล owner ใหม่จาก JSON
	var updatedOwner entity.Owner
	if err := c.ShouldBindJSON(&updatedOwner); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// อัปเดตข้อมูลอื่น ๆ ของ owner ยกเว้นรูปภาพ
	if err := db.Model(&owner).Updates(updatedOwner).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update owner"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Owner updated successfully"})
}



