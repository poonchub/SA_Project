import "./BrandItem.css"
import "./BrandItem-half.css"
import { apiUrl } from "../../services/http";


function BrandItem(props: { brand: any; mode: any; brandClick: any; setBrandClick: any; }){
    const {brand, mode, brandClick, setBrandClick} = props;

    const imageUrl = `${apiUrl}/${brand.ImagePath}`

    if(mode=="half"){
        const con_brand = document.querySelector(".container-brand-item")
        con_brand?.setAttribute("class","container-brand-item-half _brand")
    }
    else{
        const con_brand = document.querySelector(".container-brand-item-half")
        con_brand?.setAttribute("class","container-brand-item _brand")
    }

    // จัดการการแสดงผลของ element เมื่อ click
    const allElements = document.querySelectorAll("._brand")
    const clickNowElement = document.querySelector(`#b_${brandClick}`)
    const allBrandBtn = document.querySelector("#allbrand-Btn")

    if(clickNowElement!=null && allElements!=null){
        allElements.forEach((item) => {
            // @ts-ignore
            item.style.borderColor = "transparent"
        })
        // @ts-ignore
        clickNowElement.style.borderColor = "var(--subtheme-color1)"
    }
    else {
        allElements.forEach((item) => {
            // @ts-ignore
            item.style.borderColor = "transparent"
            if (allBrandBtn){
                // @ts-ignore
                allBrandBtn.style.borderColor =  "var(--subtheme-color1)"
            }
        })
    }

    return (
        <div className="container-brand-item _brand" id={`b_${brand.ID}`} onClick={() => setBrandClick(brand.ID)}>
            <div className="img-box">
                <img src={imageUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{brand.BrandName}</h4>
            </div>
        </div>
    )
}

export default BrandItem;