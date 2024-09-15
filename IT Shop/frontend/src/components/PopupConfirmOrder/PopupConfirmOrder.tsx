import { useEffect, useState } from "react";
import { AddressInterface } from "../../Interfaces/IAddress";
import "./PopupConfirmOrder.css"
import { CreateOrder, CreateOrderItem, GetAddressByCustomerID, UpdateProduct } from "../../services/http";
import { OrderInterface } from "../../Interfaces/IOrder";
import { OrderItemInterface } from "../../Interfaces/IOrderItem";
import { selectedIndex } from "../../data/selectedIndex";
import { ProductInterFace } from "../../Interfaces/IProduct";

function PopupConfirmOrder(props: { setPopup: any; productName: any; price: any; quantity: any; products: any; messageApi: any; }){

    const {setPopup, productName, price, quantity, products, messageApi} = props

    const [addresses, setAddresses] = useState<AddressInterface[]>([]);
    const [selectedAddress, setSelectedAddress] = useState(1);

    const totalPrice = products[selectedIndex].PricePerPiece*quantity
    const priceFormat = totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })   

    function closePopup(){
        setPopup(null)
    }

    async function getAddress(){
        let res = await GetAddressByCustomerID(1)
        if (res) {
            setAddresses(res);
        }
    }

    async function createOrder() {
        try {
            const orderData: OrderInterface = {
                TotalPrice: totalPrice,
                Status: "not yet paid",
                CustomerID: 1,  // ดึงจากที่ login
                AddressID: selectedAddress
            };
            const resultOrder = await CreateOrder(orderData);

            if (resultOrder) {
                const newOrderID = resultOrder.data.ID;

                const orderItemData: OrderItemInterface = {
                    Quantity: quantity,
                    Price: totalPrice,
                    OrderID: newOrderID, 
                    ProductID: products[selectedIndex].ID
                };
    
                const resultOrderItem = await CreateOrderItem(orderItemData);

                const updateProductData: ProductInterFace = {
                    ID: products[selectedIndex].ID,
                    Stock: (products[selectedIndex].Stock)-1
                }
                const resultUpdateProduct = await UpdateProduct(updateProductData)
    
                if (resultOrderItem && resultUpdateProduct) {
                    messageApi.open({
                        type: "success",
                        content: "คำสั่งซื้อของคุณถูกสร้างเรียบร้อยแล้ว",
                    });
                } else {
                    messageApi.open({
                        type: "error",
                        content: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
                    });
                }
            } else {
                messageApi.open({
                    type: "error",
                    content: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
                });
            }

        } catch (error) {
            console.error("Error creating order:", error);
            messageApi.open({
                type: "error",
                content: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
            });
        }

        setTimeout(() => {
            location.href = "/Product";
        }, 1800);
    }

    // @ts-ignore
    const handleSelect = (id) => {
        setSelectedAddress(id);
    };

    useEffect(()=> {
        getAddress()
    }, [])

    const addressElement = addresses.map((subAddress, index) => {
        return (
            <table key={index} width={"100%"}><tbody><tr>
                <td style={{
                    border: "1px solid lightgray",
                    borderRadius: "5px",
                }}> 
                    <table><tbody><tr>
                        <td style={{padding: "0px 10px"}}>
                            <input type="radio" 
                                name="Address" 
                                checked={selectedAddress === subAddress.ID}
                                onChange={() => handleSelect(subAddress.ID)}
                            />
                        </td>
                        <td className="detail" 
                            onClick={() => handleSelect(subAddress.ID)}
                            style={{ cursor: 'pointer', width:"auto" }}
                        >   
                            {subAddress.AddressDetail}{",\t"}
                            แขวง/ตำบล: {subAddress.Subdistrict}{",\t"}
                            อำเภอ/เขต: {subAddress.District}{",\t"}
                            จังหวัด: {subAddress.Province}{",\t"}
                            รหัสไปรษณีย์: {subAddress.ZipCode}
                            
                        </td>
                    </tr></tbody></table>
                </td>  
            </tr></tbody></table>
        )
    })

    return (
        <div className="popup-container">
            <div className="popup-bg"></div>
            <div className="detail-box">
                <span className="title">ยืนยันคำสั่งซื้อ</span>
                <table>
                    <tbody>
                        <tr>
                            <td className="sub-t" >สินค้า</td>
                            <td>{productName}</td>
                        </tr>
                        <tr>
                            <td className="sub-t" >จำนวน</td>
                            <td>{quantity} ชิ้น</td>
                        </tr>
                        <tr>
                            <td className="sub-t">ราคาต่อชิ้น</td>
                            <td>{price} บาท</td>
                        </tr>
                        <tr>
                            <td className="sub-t">ราคารวม</td>
                            <td>{priceFormat} บาท</td>
                        </tr>
                        <tr>
                            <td className="sub-t">ที่อยู่</td>
                            <td>
                                {addressElement}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="btn-box">
                    <button className="cancel-btn" onClick={closePopup}>ยกเลิก</button>
                    <button className="confirm-btn" onClick={createOrder}>ยืนยันคำสั่งซื้อ</button>
                </div>
            </div>
        </div>
    )
}

export default PopupConfirmOrder;