import product from "../data/product";
import "../stylesheet/ShowImage.css"
import SmallImage from "./SmallImage";

function ShowImage(){

    return (
        <div className="showimage-container">
            <div className="main-container-img-box">
                <img src={product[0].thumbnailUrl.pic1} alt="" />
            </div>
            <div className="sub-container-img-box">
                <a className="button-left">
                    <img src="" alt="" />
                </a>
                <div className="img-box">
                    <SmallImage product={product[0].thumbnailUrl.pic1}/>
                    <SmallImage product={product[0].thumbnailUrl.pic2}/>
                    <SmallImage product={product[0].thumbnailUrl.pic3}/>
                    <SmallImage product={product[0].thumbnailUrl.pic4}/>
                    <SmallImage product={product[0].thumbnailUrl.pic5}/>
                </div>
                <a className="button-right">
                    <img src="" alt="" />
                </a>
            </div>
        </div>
    )
}

export default ShowImage;