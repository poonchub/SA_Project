package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListProducts(c *gin.Context) {
	var products []entity.Product

	db := config.DB()

	db.Find(&products)

	c.JSON(http.StatusOK, &products)
}