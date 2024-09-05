import { useState } from "react";
import Header from "../components/Header/Header";
import { CreateImage } from "../services/http";

function Home(){
    const [images, setImages] = useState([]);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleImageChange = (e:any) => {
        const file = e.target.files
        setImages(file);
    };

    console.log(images)

    const handleUpload = async () => {
        if (images.length === 0){
            setUploadMessage("Please select images to upload.");
            return;
        } 

        const formData = new FormData();
        for (const image of images) {
            formData.append('image', image);
        }
        const res = await CreateImage(formData)
        console.log(res)
    };

    return (
        <>
            <Header page={"home"}/>
            <div className="input-image" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh"
            }}>
                <input type="file" 
                    onChange={handleImageChange} 
                    multiple
                />
                <button onClick={handleUpload}>Upload</button>
                {uploadMessage && <p>{uploadMessage}</p>}
            </div>
        </>
    )
}

export default Home;