import "./ProductItem.css"
import { Link } from "react-router-dom";
import { setSelectedIndex } from "../../data/selectedIndex";

function ProductItem(props: { product: any; index: any; }){

    const {product, index} = props;
    const num = product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    
    return (
        <Link to="/Selected" onClick={()=> setSelectedIndex(index)}> 
            <div className="container-product-item">
                <div className="img-box">
                    <img src={product.thumbnailUrl.pic1} alt="" />
                </div>
                <div className="detail-box">
                    <div className="box1">
                        <div className="productname">
                            {product.productName}
                        </div>
                        <div className="brand">
                            brand: {product.brand}
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