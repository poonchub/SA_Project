import product from "../data/product"
import "../stylesheet/ShowProduct.css"
import ProductItem from "./ProductItem"

function ShowProduct(){

    const productElements = product.map((subProduct,index) => {
        return <ProductItem key={index} product={subProduct}/>
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