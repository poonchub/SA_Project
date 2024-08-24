
import product from "../../data/product"
import ProductItem from "../ProductItem/ProductItem"
import "./ShowProduct.css"


function ShowProduct(){

    const productElements = product.map((subProduct, index) => {
        return <ProductItem key={index} product={subProduct} index={index}/>
    })

    return (
        <div className="container-showproduct">
            <div className="grid-container">
                {productElements}
            </div>
        </div>
    )
}

export default ShowProduct;