package main

import (
	"main/config"
	"main/controller"
	"net/http"

	"github.com/gin-gonic/gin"
)

const PORT = "8000"

func main() {
	config.ConnectionDB()
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	r.POST("/signin", controller.SignIn)

	r.Static("/images", "./images")

	router := r.Group("/")
	{
		// Adderss
		router.GET("/addresses", controller.ListAddresses)
		router.GET("/address/:id", controller.GetAddressByID)
		router.GET("/addresses/:id", controller.GetAddressByCustomerID)
		router.PATCH("/addresses", controller.UpdateAddress)
		router.GET("/addresseOrder/:id", controller.GetAddressByOrderID)

		// Brand
		router.GET("/brands", controller.ListBrands)

		// Cart

		// Category
		router.GET("/categories", controller.ListCategories)

		// Customer
		router.GET("/customers", controller.ListCustomers)
		router.GET("/customer/:id", controller.GetCustomerByID)
		router.PATCH("/customers", controller.UpdateCustomer)

		// Order
		router.GET("/orders", controller.ListOrders)
		router.GET("/order/:id", controller.GetOrderByID)
		router.GET("/orders/:id", controller.GetOrderByCustomerID)
		router.POST("/order", controller.CreateOrder)
		router.PATCH("/order", controller.UpdateOrder)

		// OrderItem
		router.GET("/orderItems", controller.ListOrderItems)
		router.GET("/orderItem/:id", controller.GetOrderItemByID)
		router.POST("/orderItem", controller.CreateOrderItem)
		router.PATCH("/orderItem", controller.UpdateOrderItem)
		router.GET("/orderItems/:id", controller.GetOrderItemsByOrderID)

		// Owner

		// Payment
		router.GET("/payments", controller.ListPayment)
		router.POST("/payment", controller.CreatePayment)

		// Image
		router.GET("/product-images/:productId", controller.GetImageByProductByID)
		router.POST("/product-image/:productId", controller.CreateImage)

		// Product
		router.GET("/products", controller.ListProducts)
		router.GET("/product/:id", controller.GetProductByID)
		router.PATCH("/product", controller.UpdateProduct)

		// cart
		router.PATCH("/updateCart/:id", controller.UpdateCart)        //update quantity
		router.DELETE("/deleteCart/:id", controller.DelteProductCart) //delete cart by user id
		router.POST("/c/:id", controller.CreateCartByChat)            // create cart by user id
		router.GET("/cart/:customerId", controller.GetCartByCustomer) // get cart by user id

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
