import { useEffect, useState } from "react";
import "./UploadPicture.css"
import { CreateImage } from "../../services/http";

function UploadPicture(){
    const [images, setImages] = useState([]);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleImageChange = (e:any) => {
        const file = e.target.files
        setImages(file);
    };

    useEffect(()=>{
        if (images.length === 0){
            setUploadMessage("Please select images to upload.");
            return;
        }
    }, [images])

    const handleUpload = async (e:any) => {
        e.preventDefault()
        const formData = new FormData();
        for (const image of images) {
            formData.append('image', image);
        }
        
        try {
            const res = await CreateImage(formData);
            console.log(res.message)
            if (res) {
                setUploadMessage(res.message);
            } else {
                setUploadMessage("Failed to upload images. Please try again.");
            }
        } catch (error) {
            setUploadMessage("Error uploading images. Please try again.");
        }
        
    };

    return (
        <div className="create-product">
            <form className="upload-form" onSubmit={handleUpload}>
                <label className="image-label">Image File</label>
                <input type="file" 
                    onChange={handleImageChange} 
                    multiple
                />
                <input className="submit-btn" type="submit"/>
            </form>
            <p className="message">{uploadMessage}</p>
        </div>
    )
}

export default UploadPicture