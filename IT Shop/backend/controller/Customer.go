package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ListCustomers(c *gin.Context) {
	var customers []entity.Customer

	db := config.DB()

	db.Find(&customers)

	c.JSON(http.StatusOK, &customers)
}

