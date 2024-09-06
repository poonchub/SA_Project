package controller

import (
	"main/config"
	"main/entity"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GET /images/:productId
func GetImageByProductByID(c *gin.Context){
	productID := c.Param("productId")
	var image []entity.Image

	db := config.DB()
	results := db.Preload("Product.Category.Owner").Preload("Product.Brand").Find(&image, "product_id=?", productID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

// POST /image/:productId
func CreateImage(c *gin.Context){
	productID, err := strconv.ParseUint(c.Param("productId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	db := config.DB()

	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file is received"})
		return
	}

	files := form.File["image"]

	for _, file := range files{
		subfolder := "product1"		
		fileName := filepath.Base(file.Filename)
		filePath := filepath.Join("images", "product", subfolder, fileName)	

		// สร้างตำแหน่งโฟลเดอร์ที่จะเก็บถ้ายังไม่มี
		err = os.MkdirAll(filepath.Join("images", "product", subfolder), os.ModePerm)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
			return
		}

		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
			return
		}

		var product entity.Product
		if err := db.First(&product, productID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}

		image := entity.Image{
			FilePath:  filePath,
			ProductID: uint(productID),
			Product:   product,
		}
		if err := db.Create(&image).Error; 
		err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files uploaded successfully"})
}