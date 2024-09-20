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

	r.POST("/signin-customer", controller.SignInForCustomer)
	r.POST("/signin-owner", controller.SignInForOwner)

	r.Static("/images", "./images")

	router := r.Group("/")

	{
		// Gender
		router.GET("/genders", controller.ListGenders)

		// Adderss
		router.GET("/addresses", controller.ListAddresses)
		router.GET("/address/:id", controller.GetAddressByID)
		router.GET("/addresses/:id", controller.GetAddressByCustomerID)
		router.PATCH("/address/:id", controller.UpdateAddressByID)
		router.GET("/addresseOrder/:id", controller.GetAddressByOrderID)
		router.POST("/address", controller.AddAddress)

		// Brand
		router.GET("/brands", controller.ListBrands)

		// Cart
		router.PATCH("/updateCart/:id", controller.UpdateCart)        //update quantity
		router.DELETE("/deleteCart/:id", controller.DelteProductCart) //delete cart by user id
		router.POST("/c/:id", controller.CreateCartByChat)            // create cart by user id
		router.GET("/cart/:customerId", controller.GetCartByCustomer) // get cart by user id
		router.PATCH("/product/:productid", controller.UpdateProductFromCart)

		// Category
		router.GET("/categories", controller.ListCategories)

		// Customer
		router.GET("/customers", controller.ListCustomers)
		router.GET("/customer/:id", controller.GetCustomerByID)
		router.PATCH("/customer/:id", controller.UpdateCustomerByID)
		router.PATCH("/customer-upload-profile/", controller.UploadProfilePicture)

		router.POST("/customer", controller.CreateCustomer)
		// router.PATCH("/customer/:id/profilepicture", controller.UpdateProfilePicture)

		// Order
		router.GET("/orders", controller.ListOrders)
		router.GET("/order/:id", controller.GetOrderByID)
		router.GET("/orders/:id", controller.GetOrderByCustomerID)
		router.POST("/order", controller.CreateOrder)
		router.PATCH("/order", controller.UpdateOrder)
		router.PATCH("/order/:id/address", controller.UpdateOrderAddressByOrderID)

		// OrderItem
		router.GET("/orderItems", controller.ListOrderItems)
		router.GET("/orderItem/:id", controller.GetOrderItemByID)
		router.POST("/orderItem", controller.CreateOrderItem)
		router.PATCH("/orderItem", controller.UpdateOrderItem)
		router.GET("/orderItems/:id", controller.GetOrderItemsByOrderID)

		// Owner
		router.GET("/owners", controller.ListOwner)
		router.GET("/owner/:id", controller.GetOwnerByID)

		// Payment
		router.GET("/payments", controller.ListPayment)
		router.POST("/payment", controller.CreatePayment)

		// Image Routes
		router.GET("/product-images", controller.ListImages)
		router.GET("/product-images/:productId", controller.GetImageByProductByID)
		router.POST("/product-image/:productId", controller.CreateImage)
		router.PUT("/product-image/:productId", controller.UpdateImage)

		// Product
		router.GET("/products", controller.ListProducts)
		router.GET("/products/:id", controller.GetProductByID)
		router.POST("/products", controller.CreateProduct)
		router.PATCH("/products/:id", controller.UpdateProduct)
		router.DELETE("/products/:id", controller.DeleteProduct)

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
