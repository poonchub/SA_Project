import { useEffect, useState } from "react";
import product from "../../data/product"
import "./ShowDetail.css"
import { GetProduct } from "../../services/http";
import { ProductInterFace } from "../../Interfaces/IProduct";
import { selectedIndex } from "../../data/selectedIndex";

function ShowDetail(){

    const [products, setProducts] = useState<ProductInterFace[]>([]);
    const [quantity, setQuantity] = useState(1);

    async function getProducts(){
        let res = await GetProduct()
        if (res) {
            setProducts(res);
        }
    }

    useEffect(()=> {
        getProducts()
    }, [])

    // @ts-ignore
    const productName = products.length > 0 ? products[selectedIndex].ProductName : '';
    // @ts-ignore
    const brand = products.length > 0 ? products[selectedIndex].Brand.Name : '';
    // @ts-ignore
    const stock = products.length > 0 ? products[selectedIndex].Stock : '';
    // @ts-ignore
    const price = products.length > 0 ? products[selectedIndex].PricePerPiece.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
    // @ts-ignore
    const description = products.length > 0 ? products[selectedIndex].Description : '';
    // @ts-ignore
    const wordsArray = description.split("\n");

    const desElement = wordsArray.map((words, index) => {
        const w = words.trim().split("\t")
        return (
            <tr key={index}>
                {w.map((_w, index) => (
                    <td key={index} style={{
                        padding: '10px 25px 10px 30px',
                        borderBottom: "1px solid lightgray",
                        width: index === 0 ? '22%' : 'auto'
                    }}>
                        {_w}
                    </td>
                ))}
            </tr>
        )
    })

    function add(){
        setQuantity(quantity+1)
    }

    function minus(){
        if (quantity==1){
            setQuantity(1)
        }
        else {
            setQuantity(quantity-1)
        }
    }

    return (
        <div className="showdetail-container">
            <div className="text-box">
                <div className="sub-text-box">
                    <div className="productname-box">
                        {productName}
                    </div>
                    <div className="brand-box">
                        Brand: {brand}<br/>
                        Stock : {stock}
                    </div>
                </div>
                <div className="price-box">
                    ฿{price}
                </div>
            </div>
            <div className="active-box">
                <div className="quantity-box">
                    <span>Quantity:</span>
                    <div className="quantity-btn" id="minus-button" onClick={minus}>
                        {/* − */}
                        <img src="" alt="" />
                    </div>
                    <span className="num-of-quantity">
                        {quantity}
                    </span>
                    <div className="quantity-btn" id="add-button" onClick={add}>
                        {/* + */}
                        <img src="" alt="" />
                    </div>
                </div>
                <div className="button-box">
                    <div className="btn" id="cart-button">
                        เพิ่มลงตะกร้า
                    </div>
                    <div className="btn" id="order-button">
                        ซื้อทันที
                    </div>
                </div>
            </div>
            <div className="line">
            </div>
            <div className="des-ti">
                Description
            </div>
            <table className="des-text">
                {desElement}
            </table>   
        </div>
    )
}

export default ShowDetail;