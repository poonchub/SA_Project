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
		// Adderss
		router.GET("/addresses", controller.ListAddresses)
		router.GET("/address/:id", controller.GetAddressByID)

		// Brand
		router.GET("/brands", controller.ListBrands)

		// Cart

		// Category
		router.GET("/categories", controller.ListCategories)

		// Customer

		// Order 
		router.GET("/orders", controller.ListOrders)
		router.GET("/order/:id", controller.GetOrderByID)
		router.GET("/orders/:id", controller.GetOrderByCustomerID)
		router.GET("/neworder/:id", controller.GetNewOrderByCustomerID)
		router.POST("/order", controller.CreateOrder)
		router.PATCH("/order", controller.UpdateOrder)

		// OrderItem
		router.GET("/orderItems", controller.ListOrderItems)
		router.GET("/orderItem/:id", controller.GetOrderItemByID)
		router.POST("/orderItem", controller.CreateOrderItem)
		router.PATCH("/orderItem", controller.UpdateOrderItem)

		// Owner

		// Payment

		// Picture
		router.GET("/pictures", controller.ListPictures)
		router.GET("/picture/:id", controller.GetPictureByProductID)

		// Product
		router.GET("/products", controller.ListProducts)
		router.GET("/product/:id", controller.GetProductByID)

	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

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