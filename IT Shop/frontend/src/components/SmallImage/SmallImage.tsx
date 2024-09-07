import { useEffect } from "react";
import "./SmallImage.css"
import { apiUrl } from "../../services/http";

function SmallImage(props: { image: any; setMainImg: any; imgClick: any; setImgClick: any }){

    const {image, setMainImg, imgClick, setImgClick} = props

    const imageUrl = `${apiUrl}/${image.FilePath}`

    // useEffect(()=>{
    //     const allElement = document.querySelectorAll(".small-img")
    //     const clickElement = document.querySelector(`#img${imgClick}`)
    //     if (clickElement!=null){
    //         allElement.forEach((item)=>{
    //             // @ts-ignore
    //             item.style.borderColor = "transparent"
    //         })
    //         // @ts-ignore
    //         clickElement.style.borderColor = "var(--subtheme-color1)"
    //     }
    // }, [imgClick])

    return (
        <div className="smallimage-container">
            <img className="small-img" src={imageUrl} alt="" 
                id={`img${image.ID}`} 
                onClick={()=> {
                    setMainImg(imageUrl)
                    setImgClick(image.ID)
                }}
                style={{
                    borderColor: image.ID==imgClick ? "var(--subtheme-color1)" : "transparent"
                }}
            />
        </div>
    )
}

export default SmallImage;