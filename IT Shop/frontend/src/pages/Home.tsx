import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { CreateImage } from "../services/http";

function Home(){
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

    console.log(images)

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
        <>
            <Header page={"home"}/>
            <div className="create-product" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh",
                flexDirection: "column"
            }}>
                <form onSubmit={handleUpload} style={{
                    display:"flex",
                    flexDirection:"column"
                }}>
                    <label style={{marginTop: "7px"}}>Image File</label>
                    <input type="file" 
                        onChange={handleImageChange} 
                        multiple
                    />
                    <input type="submit" style={{marginTop: "7px"}}/>
                </form>
                
                {uploadMessage && <p>{uploadMessage}</p>}
            </div>
        </>
    )
}

export default Home;