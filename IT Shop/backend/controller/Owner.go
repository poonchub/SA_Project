package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListOwner(c *gin.Context){
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
