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