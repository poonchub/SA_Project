// utils/cropImage.ts
export const getCroppedImg = (imageSrc: string, crop: any) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
  
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
  
        canvas.width = crop.width;
        canvas.height = crop.height;
        ctx.drawImage(
          image,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
  
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve(croppedImageUrl);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg');
      };
  
      image.onerror = (error) => {
        reject(error);
      };
    });
  };
  