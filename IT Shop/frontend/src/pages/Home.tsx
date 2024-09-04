import { useState } from "react";
import Header from "../components/Header/Header";
import { CreateImage } from "../services/http";

function Home(){
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadMessage, setUploadMessage] = useState('');

    const handleImageChange = (e:any) => {
        const file = e.target.files[0];
        setImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        await CreateImage(formData)

    };

    return (
        <>
            {/* <Header page={"home"}/> */}
            <div className="input-image" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
                height: "100vh"
            }}>
                <input type="file" onChange={handleImageChange} />
                {previewUrl && <img src={previewUrl} alt="Preview" width="200" />}
                <button onClick={handleUpload}>Upload</button>
                {uploadMessage && <p>{uploadMessage}</p>}
            </div>
        </>
    )
}

export default Home;