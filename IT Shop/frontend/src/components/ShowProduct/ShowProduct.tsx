
import { useEffect, useState } from "react";
// import product from "../../data/product"
import { GetProduct } from "../../services/http";
import ProductItem from "../ProductItem/ProductItem"
import "./ShowProduct.css"
import { ProductInterFace } from "../../Interfaces/IProduct";


function ShowProduct(){

    const [products, setProducts] = useState<ProductInterFace[]>([]);

    async function getProducts(){
        let res = await GetProduct()
        if (res) {
            setProducts(res);
        }
    }

    useEffect(()=> {
        getProducts()
    }, [])

    const productElements = products.map((subProduct, index) => {
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