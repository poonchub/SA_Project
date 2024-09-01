import "./ProductItem.css"
import { Link } from "react-router-dom";
import { setSelectedIndex } from "../../data/selectedIndex";
import { PictureInterface } from "../../Interfaces/IPicture";
import { useEffect, useState } from "react";
import { GetPictureByProductID } from "../../services/http";

function ProductItem(props: { product: any; searchText: any; }){

    const {product, searchText} = props;

    const [pictures, setPictures] = useState<PictureInterface[]>([]);

    async function getPictures(){
        let res = await GetPictureByProductID(product.ID)
        if (res) {
            setPictures(res);
        }
    }

    useEffect(()=> {
        getPictures()
    }, [searchText])
    
    const picture = pictures.length > 0 ? pictures[0].File : '';

    const imageUrl = `data:image/png;base64,${picture}`

    const num = product.PricePerPiece.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    return (
        <Link to="/Selected" onClick={()=> setSelectedIndex(product.ID-1)}> 
            <div className="container-product-item">
                <div className="img-box">
                    <img src={imageUrl} alt="" />
                </div>
                <div className="detail-box">
                    <div className="box1">
                        <div className="productname">
                            {product.ProductName}
                        </div>
                        <div className="brand">
                            brand: {product.Brand.Name}
                        </div>
                    </div>
                    <div className="price">
                        ฿{num}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductItem;