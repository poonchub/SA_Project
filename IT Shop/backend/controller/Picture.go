package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /pictures
func ListPictures(c *gin.Context) {
	var pictures []entity.Picture

	db := config.DB()

	db.Preload("Product.Category.Owner").Preload("Product.Brand").Find(&pictures)

	c.JSON(http.StatusOK, &pictures)
}

// GET /pictures/:id
func GetPictureByProductID(c *gin.Context) {
	ID := c.Param("id")
	var picture []entity.Picture

	db := config.DB()
	results := db.Find(&picture, "product_id=?", ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, picture)
}