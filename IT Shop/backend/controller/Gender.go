package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"main/config"
	"main/entity"
)

// GET /genders
func ListGenders(c *gin.Context) {
	var genders []entity.Gender

	db := config.DB()

	db.Find(&genders)

	c.JSON(http.StatusOK, &genders)
}
