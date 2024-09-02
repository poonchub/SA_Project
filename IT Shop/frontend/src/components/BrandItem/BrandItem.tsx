import "./BrandItem.css"
import "./BrandItem-half.css"

function BrandItem(props: { brand: any; mode: any; }){
    const {brand, mode} = props;

    const imageUrl = `data:image/png;base64,${brand.Picture}`

    if(mode=="half"){
        const con_brand = document.querySelector(".container-brand-item")
        con_brand?.setAttribute("class","container-brand-item-half")
    }
    else{
        const con_brand = document.querySelector(".container-brand-item-half")
        con_brand?.setAttribute("class","container-brand-item")
    }

    return (
        <div className="container-brand-item">
            <div className="img-box">
                <img src={imageUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{brand.Name}</h4>
            </div>
        </div>
    )
}

export default BrandItem;