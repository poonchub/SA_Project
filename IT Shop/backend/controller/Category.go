package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListCategories(c *gin.Context) {
	var categories []entity.Category

	db := config.DB()

	db.Preload("Owner").Find(&categories)

	c.JSON(http.StatusOK, &categories)
}