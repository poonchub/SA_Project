package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /categories
func ListCategories(c *gin.Context) {
	var categories []entity.Category

	db := config.DB()

	db.Preload("Owner").Find(&categories)

	c.JSON(http.StatusOK, &categories)
}


