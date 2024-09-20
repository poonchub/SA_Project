package controller

import (
	"main/config"
	"main/entity"
	"net/http"

	"github.com/gin-gonic/gin"

	"os"
	"path/filepath"
	// "strconv"
)

// GET /customers
func ListCustomers(c *gin.Context) {
	var customers []entity.Customer

	db := config.DB()

	db.Preload("Gender").Find(&customers)

	c.JSON(http.StatusOK, &customers)
}

// GET /customer/:id
func GetCustomerByID(c *gin.Context) {
	ID := c.Param("id")
	var customer entity.Customer

	db := config.DB()
	results := db.Preload("Gender").First(&customer, ID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	if customer.ID == 0 {
		c.JSON(http.StatusNoContent, gin.H{})
		return
	}
	c.JSON(http.StatusOK, customer)
}

// PATCH /orderItem
func UpdateCustomerByID(c *gin.Context) {
	ID := c.Param("id")

	var customer entity.Customer

	db := config.DB()
	result := db.First(&customer, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&customer); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&customer)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}



// // UpdateProfilePicture handles updating the user's profile picture
// func UpdateProfilePicture(c *gin.Context) {
// 	// Get the customer ID from the form data
// 	customerID, err := strconv.ParseUint(c.PostForm("customerID"), 10, 32)
// 	if err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customerID"})
// 		return
// 	}

// 	// Get the uploaded file
// 	form, err := c.MultipartForm()
// 	if err != nil || len(form.File["profilePicture"]) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "No profile picture file found"})
// 		return
// 	}

// 	// Open the database connection
// 	db := config.DB()

// 	// Process the uploaded file
// 	file := form.File["profilePicture"][0] // Assume only one file is uploaded
// 	subfolder := "profile_pictures"
// 	fileName := filepath.Base(file.Filename)
// 	filePath := filepath.Join("images", subfolder, fileName)

// 	// Create directory if it does not exist
// 	if err := os.MkdirAll(filepath.Join("images", subfolder), os.ModePerm); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
// 		return
// 	}

// 	// Save the uploaded file
// 	if err := c.SaveUploadedFile(file, filePath); err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
// 		return
// 	}

// 	// Find the customer and update their profile picture
// 	var customer entity.Customer
// 	if err := db.First(&customer, customerID).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
// 		return
// 	}

// 	// Update the profile path
// 	customer.ProfilePath = filePath
// 	if err := db.Save(&customer).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user profile picture"})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Profile picture updated successfully", "data": customer})
// }
// UpdateProfilePicture handles updating the user's profile picture
func UpdateProfilePicture(c *gin.Context) {
	customerID := c.Param("id") // Get the customer ID from the URL parameter

	// Get the uploaded file
	form, err := c.MultipartForm()
	if err != nil || len(form.File["profilePicture"]) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No profile picture file found"})
		return
	}

	db := config.DB()
	var customer entity.Customer
	if err := db.First(&customer, customerID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Customer not found"})
		return
	}

	// Process the uploaded file
	file := form.File["profilePicture"][0]
	subfolder := "profile_pictures"
	fileName := filepath.Base(file.Filename)
	filePath := filepath.Join("images", subfolder, fileName)

	// Create directory if it does not exist
	if err := os.MkdirAll(filepath.Join("images", subfolder), os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
		return
	}

	// Save the uploaded file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Update the profile path
	customer.ProfilePath = filePath
	if err := db.Save(&customer).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user profile picture"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile picture updated successfully", "data": customer})
}