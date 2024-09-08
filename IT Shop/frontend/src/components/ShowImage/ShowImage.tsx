import { useEffect, useRef, useState } from "react";
import SmallImage from "../SmallImage/SmallImage";
import "./ShowImage.css"
import { selectedIndex } from "../../data/selectedIndex";
import { apiUrl, GetImageByProductID } from "../../services/http";
import { ImageInterface } from "../../Interfaces/IImage";


function ShowImage(){

    const scrollRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<ImageInterface[]>([]);
    const [mainImg, setMainImg] = useState("")
    const [imgClick, setImgClick] = useState(1)

    // show first picture
    if (mainImg=="" && images.length > 0){
        const imageUrl =`${apiUrl}/${images[0].FilePath}`
        setMainImg(imageUrl)
        // @ts-ignore
        setImgClick(images[0].ID)
    }

    async function getImages(){
        let res = await GetImageByProductID(selectedIndex+1)
        if (res) {
            setImages(res);
        }
    }
    useEffect(()=> {
        getImages()
    }, [])

    const imageElements = images.map((subImage, index) => {
        return <SmallImage key={index} image={subImage} setMainImg={setMainImg} imgClick={imgClick} setImgClick={setImgClick}/>
    })

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -50,
                behavior: 'smooth'
            });
        }
      };
    
    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 50,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="showimage-container">
            <div className="background-container">
                <video className="video-background" src="./videos/bg-showimage.mp4" autoPlay loop muted></video>
            </div>
            <div className="main-container-img-box">
                <img src={mainImg} alt="" />
            </div>
            <div className="sub-container-img-box">
                <div className="btn-box" id="button-left">
                    <img src="./images/icon/left-back.png" alt="" onClick={scrollLeft}/>
                </div>
                <div className="img-small-box" ref={scrollRef}>
                    {imageElements}
                </div>
                <div className="btn-box" id="button-right">
                    <img src="./images/icon/left-back.png" alt="" onClick={scrollRight}/>
                </div>
            </div>
        </div>
    )
}

export default ShowImage;