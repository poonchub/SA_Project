import { useContext, useEffect, useState } from "react";
import { GetProduct } from "../../services/http";
import "./ShowProduct.css"
import "./ShowProduct-half.css"
import { ProductInterFace } from "../../Interfaces/IProduct";
import { Context } from "../../pages/Product";
import ProductItem from "../ProductItem/ProductItem";


function ShowProduct(){

    const [products, setProducts] = useState<ProductInterFace[]>([]);
    const {searchText, mode, minRange, maxRange, categoryClick, brandClick} = useContext(Context)

    async function getProducts(){
        let res = await GetProduct()
        if (res) {
            setProducts(res);
        }
    }

    useEffect(()=> {
        getProducts()
    }, [])

    const filteredProduct = (categoryClick!=null && brandClick!=null) ? 
        products.filter((subProduct) => {
            // @ts-ignore
            return subProduct.ProductName.toLowerCase().includes(searchText.toLowerCase()) && (subProduct.PricePerPiece >= minRange && subProduct.PricePerPiece <= maxRange) && subProduct.CategoryID==categoryClick && subProduct.BrandID==brandClick
        }
    ) : (categoryClick!=null) ? 
        products.filter((subProduct) => {
            // @ts-ignore
            return subProduct.ProductName.toLowerCase().includes(searchText.toLowerCase()) && (subProduct.PricePerPiece >= minRange && subProduct.PricePerPiece <= maxRange) && subProduct.CategoryID==categoryClick
        }
    ) : (brandClick!=null) ? 
        products.filter((subProduct) => {
            // @ts-ignore
            return subProduct.ProductName.toLowerCase().includes(searchText.toLowerCase()) && (subProduct.PricePerPiece >= minRange && subProduct.PricePerPiece <= maxRange) && subProduct.BrandID==brandClick
        }
    ) : 
        products.filter((subProduct) => {
            // @ts-ignore
            return subProduct.ProductName.toLowerCase().includes(searchText.toLowerCase()) && (subProduct.PricePerPiece >= minRange && subProduct.PricePerPiece <= maxRange)
    })

    const productElements = filteredProduct.map((subProduct, index) => {
        return <ProductItem key={index} product={subProduct} searchText={searchText} category={categoryClick} minRange={minRange} maxRange={maxRange}/>
    })

    if (mode=="half"){
        const con_show = document.querySelector(".container-showproduct")
        con_show?.setAttribute("class","container-showproduct-half")
    }
    else {
        const con_show = document.querySelector(".container-showproduct-half")
        con_show?.setAttribute("class","container-showproduct")
    }

    return (
        <div className="container-showproduct">
            <div className="grid-container">
                {productElements}
            </div>
        </div>
    )
}

export default ShowProduct;