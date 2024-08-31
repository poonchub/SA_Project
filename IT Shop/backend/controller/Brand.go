package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /brands
func ListBrands(c *gin.Context) {
	var brands []entity.Brand

	db := config.DB()

	db.Find(&brands)

	c.JSON(http.StatusOK, &brands)
}