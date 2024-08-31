import { useEffect, useRef, useState } from "react";
import SmallImage from "../SmallImage/SmallImage";
import "./ShowImage.css"
import { selectedIndex } from "../../data/selectedIndex";
import { PictureInterface } from "../../Interfaces/IPicture";
import { GetPictureByProductID } from "../../services/http";


function ShowImage(){

    const scrollRef = useRef<HTMLDivElement>(null);

    const [pictures, setPictures] = useState<PictureInterface[]>([]);

    const [mainImg, setMainImg] = useState("")

    // show first picture
    if (mainImg=="" && pictures.length > 0){
        const imageUrl = `data:image/png;base64,${pictures[0].File}`
        setMainImg(imageUrl)
    }

    async function getPictures(){
        let res = await GetPictureByProductID(selectedIndex+1)
        if (res) {
            setPictures(res);
        }
    }
    useEffect(()=> {
        getPictures()
    }, [])

    const pictureElements = pictures.map((subPicture, index) => {
        return <SmallImage key={index} picture={subPicture} setMainImg={setMainImg}/>
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
                <video className="video-background" src="./videos/video1.mp4" autoPlay loop muted></video>
            </div>
            <div className="main-container-img-box">
                <img src={mainImg} alt="" />
            </div>
            <div className="sub-container-img-box">
                <div className="btn-box" id="button-left">
                    <img src="./images/icon/left-back.png" alt="" onClick={scrollLeft}/>
                </div>
                <div className="img-small-box" ref={scrollRef}>
                    {pictureElements}
                </div>
                <div className="btn-box" id="button-right">
                    <img src="./images/icon/left-back.png" alt="" onClick={scrollRight}/>
                </div>
            </div>
        </div>
    )
}

export default ShowImage;