package controller

import (
	"main/config"
	"main/entity"
	services "main/service"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

type Authen struct{
	Email		string
	Password	string
}


func SignIn(c *gin.Context) {

	var payload Authen

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var customer entity.Customer
	db.First(&customer, payload.Email)
	if customer.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "customer not found"})
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(customer.Password), []byte(payload.Password))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "password is incerrect"})
		return
	}

	jwtWrapper := services.JwtWrapper{
		SecretKey: "$2a$14$1cMG8zYAwHJkrr0D1DWZkOAatZDM3RFCqbnI3BYgcO7ASs16hxsyC",
		Issuer: "AuthService",
		ExpirationHours: 24,
	}

	signedToken, err := jwtWrapper.GenerateToken(customer.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "error signing token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token_type": "Bearer", "token": signedToken, "id": customer.ID})
}