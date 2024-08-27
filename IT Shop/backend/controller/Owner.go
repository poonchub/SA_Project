package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListOwners(c *gin.Context) {
	var owners []entity.Owner

	db := config.DB()

	db.Find(&owners)

	c.JSON(http.StatusOK, &owners)
}