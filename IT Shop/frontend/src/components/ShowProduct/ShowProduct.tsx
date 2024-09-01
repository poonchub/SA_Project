
import { useContext, useEffect, useState } from "react";
// import product from "../../data/product"
import { GetProduct } from "../../services/http";
import ProductItem from "../ProductItem/ProductItem"
import "./ShowProduct.css"
import { ProductInterFace } from "../../Interfaces/IProduct";
import { SearchTextContext } from "../../pages/Product";


function ShowProduct(){

    const [products, setProducts] = useState<ProductInterFace[]>([]);
    const {searchText, setSearchText} = useContext(SearchTextContext)

    async function getProducts(){
        let res = await GetProduct()
        if (res) {
            setProducts(res);
        }
    }

    useEffect(()=> {
        getProducts()
    }, [])
    
    const filteredProduct = products.filter((subProduct) => {
        // @ts-ignore
        return subProduct.ProductName.toLowerCase().includes(searchText.toLowerCase());
    });

    const productElements = filteredProduct.map((subProduct, index) => {
        return <ProductItem key={index} product={subProduct} searchText={searchText}/>
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