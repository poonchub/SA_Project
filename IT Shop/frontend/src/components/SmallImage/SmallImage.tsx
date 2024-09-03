import { useEffect } from "react";
import "./SmallImage.css"

function SmallImage(props: { picture: any; setMainImg: any; imgClick: any; setImgClick: any }){

    const {picture, setMainImg, imgClick, setImgClick} = props

    const imageUrl = `data:image/png;base64,${picture.File}`

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
                id={`img${picture.ID}`} 
                onClick={()=> {
                    setMainImg(imageUrl)
                    setImgClick(picture.ID)
                }}
            />
        </div>
    )
}

export default SmallImage;