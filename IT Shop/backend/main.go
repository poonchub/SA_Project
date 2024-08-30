package main

import (
	"main/config"
	"main/controller"
	"net/http"

	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main(){
	config.ConnectionDB()
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("")
	{	
		// Product
		router.GET("/products", controller.ListProducts)

		// Category
		router.GET("/categories", controller.ListCategories)

		// Brand
		router.GET("/brands", controller.ListBrands)

		// Picture
		router.GET("/pictures", controller.ListPictures)
		router.GET("/picture/:id", controller.GetPictureByProductID)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server

	r.Run("localhost:" + PORT)

}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}