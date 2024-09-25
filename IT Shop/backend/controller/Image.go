package controller

import (
	"fmt"
	"main/config"
	"main/entity"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ListImages(c *gin.Context) {
	var images []entity.Image

	db := config.DB()
	if err := db.Find(&images).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, images)
}





// GET /images/:productId
func GetImageByProductByID(c *gin.Context){
	productID := c.Param("productId")
	var image []entity.Image

	db := config.DB()
	results := db.Preload("Product.Brand").Find(&image, "product_id=?", productID)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, image)
}

// POST /image/:productId
func CreateImage(c *gin.Context) {
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

	for _, file := range files {
		subfolder := "product" + strconv.Itoa(int(productID))

		// ลบไฟล์รูปเก่าก่อนถ้ามี
		var oldImages []entity.Image
		if err := db.Where("product_id = ?", productID).Find(&oldImages).Error; err == nil {
			for _, oldImage := range oldImages {
				if err := os.Remove(oldImage.FilePath); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old file"})
					return
				}
				// ลบจากฐานข้อมูลด้วย
				if err := db.Delete(&oldImage).Error; err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old file from database"})
					return
				}
			}
		}

		// เปลี่ยนชื่อไฟล์เป็น pตามด้วยตัวเลขถ้าหลักหน่วยให้ขึ้นต้นด้วย 0
		imageCount := len(files)
		fileName := fmt.Sprintf("p%02d", imageCount) + filepath.Ext(file.Filename)
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
		if err := db.Create(&image).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files uploaded successfully"})
}

func UpdateImage(c *gin.Context) {
    productID, err := strconv.ParseUint(c.Param("productId"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    db := config.DB()

    form, err := c.MultipartForm()
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No files received"})
        return
    }

    files := form.File["image"]

    if len(files) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "No image files provided"})
        return
    }

    // ค้นหารูปภาพที่มีอยู่เพื่อทำการลบ
    var existingImages []entity.Image
    if err := db.Where("product_id = ?", productID).Find(&existingImages).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    // ลบรูปภาพเก่าที่มีอยู่
    for _, img := range existingImages {
        if err := os.Remove(img.FilePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old image"})
            return
        }
        if err := db.Delete(&img).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete image record"})
            return
        }
    }

    // บันทึกรูปภาพใหม่
    for i, file := range files {
        subfolder := "product" + strconv.Itoa(int(productID))

        // เปลี่ยนชื่อไฟล์ใหม่ให้เป็น pตามด้วยตัวเลข เช่น p01, p02
        fileName := fmt.Sprintf("p%02d", i+1) + filepath.Ext(file.Filename)
        filePath := filepath.Join("images", "product", subfolder, fileName)

        err = os.MkdirAll(filepath.Join("images", "product", subfolder), os.ModePerm)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
            return
        }

        if err := c.SaveUploadedFile(file, filePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
            return
        }

        image := entity.Image{
            FilePath:  filePath,
            ProductID: uint(productID),
        }
        if err := db.Create(&image).Error; err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
    }

    c.JSON(http.StatusOK, gin.H{"message": "Files updated successfully"})
}

