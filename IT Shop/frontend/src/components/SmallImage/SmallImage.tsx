import { useEffect } from "react";
import "./SmallImage.css"
import { apiUrl } from "../../services/http";

function SmallImage(props: { image: any; setMainImg: any; imgClick: any; setImgClick: any }){

    const {image, setMainImg, imgClick, setImgClick} = props

    const imageUrl = `${apiUrl}/${image.FilePath}`

    // จัดการการแสดงผลของ element เมื่อ click
    const allElements = document.querySelectorAll(".small-img")
    const clickNowElement = document.querySelector(`#img${imgClick}`)

    // if(clickNowElement!=null && allElements!=null){
    //     allElements.forEach((item) => {
    //         // @ts-ignore
    //         item.style.borderColor = "transparent"
    //     })
    //     // @ts-ignore
    //     clickNowElement.style.borderColor = "var(--subtheme-color1)"
    // }
    // else {
    //     allElements.forEach((item) => {
    //         // @ts-ignore
    //         item.style.borderColor = "transparent"
    //     })
    // }

    return (
        <div className="smallimage-container">
            <img className="small-img" src={imageUrl} alt="" 
                id={`img${image.ID}`} 
                onClick={()=> {
                    setMainImg(imageUrl)
                    setImgClick(image.ID)
                }}
            />
        </div>
    )
}

export default SmallImage;