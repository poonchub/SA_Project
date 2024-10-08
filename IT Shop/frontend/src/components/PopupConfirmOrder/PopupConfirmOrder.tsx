import { useEffect, useState } from "react";
import { AddressInterface } from "../../Interfaces/IAddress";
import "./PopupConfirmOrder.css"
import { CreateOrder, CreateOrderItem, GetAddressByCustomerID, GetCustomerByID, UpdateProductByID } from "../../services/http";
import { OrderInterface } from "../../Interfaces/IOrder";
import { OrderItemInterface } from "../../Interfaces/IOrderItem";
import { ProductInterface } from "../../Interfaces/IProduct";
import { CustomerInterface } from "../../Interfaces/ICustomer";
import { Link } from "react-router-dom";

function PopupConfirmOrder(props: { setPopup: any; productName: any; price: any; quantity: any; products: any; messageApi: any; }){

    const {setPopup, productName, price, quantity, products, messageApi} = props
    
    const [customer, setCustomer] = useState<CustomerInterface>()
    const [addresses, setAddresses] = useState<AddressInterface[]>([]);
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    const sltProductStr = localStorage.getItem("sltProduct")
    const sltProduct = sltProductStr!=null ? parseInt(sltProductStr) : 0;

    const fullPrice = products[sltProduct].PricePerPiece*quantity

    const discount = fullPrice>=1000 ? Math.round(fullPrice*(3/100)) : 0
    const totalPrice = fullPrice-discount
    const discountFormat = (discount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    const priceFormat = (totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    console.log((fullPrice*(3/100)).toFixed(2))
    console.log(totalPrice)

    function closePopup(){
        setPopup(null)
    }

    async function getAddress(){
        const cutomerID = localStorage.getItem("id")
        let res = await GetAddressByCustomerID(cutomerID!=null ? parseInt(cutomerID): 0)
        if (res) {
            setAddresses(res);
        }
    }

    async function getCustomer(){
        const cutomerID = localStorage.getItem("id")
        let res = await GetCustomerByID(cutomerID!=null ? parseInt(cutomerID): 0)
        if (res) {
            setCustomer(res);
        }
    }

    async function createOrder() {
        try {
            setIsButtonDisabled(true);
            localStorage.setItem("before-add-address","")
            const cutomerID = localStorage.getItem("id")
            const orderData: OrderInterface = {
                TotalPrice: totalPrice,
                Status: "รอการชำระเงิน",
                CustomerID: cutomerID!=null ? parseInt(cutomerID): 0,
                AddressID: selectedAddress
            };
            const resultOrder = await CreateOrder(orderData);

            if (resultOrder) {
                const newOrderID = resultOrder.data.ID;
                localStorage.setItem("orderId", `${newOrderID}`)
                const orderItemData: OrderItemInterface = {
                    Quantity: quantity,
                    Price: fullPrice,
                    OrderID: newOrderID, 
                    ProductID: products[sltProduct].ID
                };
    
                const resultOrderItem = await CreateOrderItem(orderItemData);

                const updateProductData: ProductInterface = {
                    Stock: (products[sltProduct].Stock)-quantity
                }
                const resultUpdateProduct = await UpdateProductByID(updateProductData,products[sltProduct].ID)
    
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
            location.href = "/Payment";
            setIsButtonDisabled(false);
        }, 1800);
    }

    // @ts-ignore
    const handleSelect = (id) => {
        setSelectedAddress(id);
    };

    useEffect(()=> {
        getAddress()
        getCustomer()
    }, [])

    const addressElement = addresses.length<1 ? (
        <div className="no-add-element">
            <Link to={"/AddAddress"} onClick={()=>localStorage.setItem("before-add-address","/selected")}>
                <button className="create-add-btn">สร้างที่อยู่</button>
            </Link>
            <span>หากยังไม่มีที่อยู่จะไม่สามารถสั่งซื้อสินค้าได้</span>
        </div>
        ) : addresses.map((subAddress, index) => {
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
                            รหัสไปรษณีย์: {subAddress.ZipCode}{",\t"}
                            เบอร์โทร: {customer ? customer.PhoneNumber : ""}
                        </td>
                    </tr></tbody></table>
                </td>  
            </tr></tbody></table>
        )
    })

    return (
        <div className="popup-con-container">
            <div className="popup-bg" onClick={closePopup}></div>
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
                            <td className="sub-t">ส่วนลด</td>
                            <td>{discountFormat} บาท</td>
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
                    <button 
                        className="confirm-btn" 
                        disabled={isButtonDisabled} 
                        onClick={createOrder}
                        style={{
                            pointerEvents: addresses.length>0 ? "auto" : "none",
                            opacity: addresses.length>0 ? "1" : "0.6"
                        }}
                    >ยืนยันคำสั่งซื้อ</button>
                </div>
            </div>
        </div>
    )
}

export default PopupConfirmOrder;