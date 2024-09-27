import "../CartSummary/Summary.css";
import { CartInterface } from "../../Interfaces/ICart";
import { CreateOrder, CreateOrderItem, DeleteCart, GetAddressByCustomerID, UpdateProductByID } from "../../services/http";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { AddressInterface } from "../../Interfaces/IAddress";
import { OrderInterface } from "../../Interfaces/IOrder";
import { ProductInterface } from "../../Interfaces/IProduct";
import { OrderItemInterface } from "../../Interfaces/IOrderItem";
import { message } from "antd";
import { formatNumber } from "../CartItem/Card";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../pages/Payment'
import { AnimatePresence, motion } from "framer-motion";
import { add } from "three/webgpu";

interface TotalPriceProps {
  cartItems: CartInterface[] | null;
  selectedItems: number[];
  onCartUpdate: () => void;
}

function Summary({ cartItems, selectedItems, onCartUpdate }: TotalPriceProps) {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(1);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const [usepopup, setUsePopup] = useState(false);
  const [address, setAddress] = useState<AddressInterface[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate(); // Initialize useNavigate

  // คำนวณยอดรวม
  const calculateTotalPrice = () => {
    if (!cartItems) return 0;
    return cartItems
      .filter((item) => selectedItems.includes(item.ID || 0))
      .reduce((total, item) => {
        return total + item.Product.PricePerPiece * Number(item.Quantity);
      }, 0);
  };

  const calculateDiscount = (totalPrice: number): number => {
    // Calculate the discount here
    if (totalPrice >= 1000) {
      return Math.round(totalPrice * 0.03);
    } else {
      return 0;
    }
  };
  // ฟังก์ชันสำหรับการกดปุ่มชำระเงิน
  const handleCheckout = async () => {
    if (!cartItems) return;

    const selected = cartItems
      .filter((item) => selectedItems.includes(item.ID || 0))
      .map((item) => ({
        id: item.ID,
        productName: item.Product.ProductName,
        productID: item.Product.ID,
        quantity: item.Quantity,
        price: item.Product.PricePerPiece,
        totalPrice: item.Product.PricePerPiece * Number(item.Quantity),
      }));

    // แสดงผลใน console
    console.log("Selected Products:", JSON.stringify(selected, null, 2));
    console.log("Selected Address ID:", selectedAddress);
    
   if (selected.length === 0) {
      messageApi.open({
        type: "error",
        content: "กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ",
        duration: 2,
      });
      return;
    }
    else{
      setUsePopup(true);
      setSelectedProducts(selected);
    }

    
  };

  const ClearCartItemOnSelect = async () => {
    try {
      for (const item of selectedProducts) {
        await DeleteCart(item.id);
      }
      onCartUpdate();
    } catch (error) {
      console.error("Error clearing cart items:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการลบสินค้าจากตะกร้า",
      });
    }
  };

  // ดึงข้อมูลที่อยู่
  const getAddress = async () => {
    try {
      const cus_id = Number(localStorage.getItem("id"));
      const res = await GetAddressByCustomerID(cus_id);
      
      if (res) setAddress(res);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่",
      });
    }
  };

  useEffect(() => {
    getAddress();
   
  }, []);
  console.log("Selected item in cart ID", selectedItems);

  const handleSelect = (id: number | undefined) => {
    setSelectedAddress(id as number);
    console.log("Selected Address ID:", id);
  };

  const createOrderFromCart = async () => {
    try {
      const cus_id = Number(localStorage.getItem("id"));
      if (totalPrice > 0 && address.length > 0) {

        const orderData: OrderInterface = {
        TotalPrice: finalPrice,
        Status: "รอการชำระเงิน",
        CustomerID: cus_id,
        AddressID: Number(selectedAddress),
      };
      console.log("Order Data:", orderData);
      const resultOrder = await CreateOrder(orderData);
      let count = 0;

      if (cartItems) {
        const selected = cartItems
          .filter((item) => selectedItems.includes(item.ID || 0))
          .map((item) => ({
            id: item.ID,
            productName: item.Product.ProductName,
            productID: item.Product.ID,
            quantity: item.Quantity,
            price: item.Product.PricePerPiece,
            stock: item.Product.Stock,
          }));

        for (const item of selected) {
          const orderItemData: OrderItemInterface = {
            Quantity: Number(item.quantity),
            Price: item.price,
            OrderID: resultOrder.data.ID,
            ProductID: item.productID,
          };
          console.log("Order Item Data:", orderItemData);
         
          await CreateOrderItem(orderItemData);
          const updateProductData: ProductInterface = {
            // ID: item.productID,
            Stock: item.stock - Number(item.quantity),
          };
        
          await UpdateProductByID(updateProductData,item.productID);
          count++;
        }
          
        if (resultOrder && count == selected.length && totalPrice > 0 && address.length > 0) {
          localStorage.setItem("orderId", resultOrder.data.ID);
          messageApi.open({
            type: "success",
            content: "คำสั่งซื้อของคุณถูกสร้างเรียบร้อยแล้ว",
            duration: 2,
          });
          await ClearCartItemOnSelect();
           // delay ก่อนไป payment
           setTimeout(() => {
            navigate('/Payment');
          }, 1000); // 1000 milliseconds = 1 seconds



        } 
        else {
          messageApi.open({
            type: "error",
            content: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
          });
        }
      }

      setUsePopup(false);
      }
      else if(address.length == 0){ 
        messageApi.open({
          type: "error",
          content: "กรุณาเพิ่มที่อยู่",
          duration: 2,
        });
        setTimeout(() => {
          navigate('/AddAddress');
        },1000)
        
      }
      else{
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
          duration: 2,
        });
      }
     

    } catch (error) {
      console.error("Error creating order:", error);
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
      });
    }
  };

  const totalPrice = calculateTotalPrice();
  const discount = calculateDiscount(totalPrice);
  const finalPrice = totalPrice - discount;

  const addressElement = address.map((subAddress, index) => (
    <table key={index} width={"100%"}><tbody><tr>
      <td style={{
        border: "1px solid lightgray",
        borderRadius: "5px",
      }}>
        <table><tbody><tr>
          <td style={{ padding: "0px 10px" }}>
            <input type="radio"
              name="Address"
              checked={selectedAddress === subAddress.ID}
              onChange={() => handleSelect(subAddress.ID)}
            />
          </td>
          <td className="detail"
            onClick={() => handleSelect(subAddress.ID)}
            style={{ cursor: 'pointer', width: "auto" }}
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
  ));

  return (
    <div className="summary-container">
      {contextHolder}
      {cartItems && selectedItems.length && cartItems.length > 0 ? (
        <>
            <AnimatePresence>
           <motion.div
                
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1,y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ duration: 0.5 }}
              
            >
          <div className="Summary">
            <div className="sum-topic">
              <p>Summary</p>
            </div>
            <div className="under">
              <hr />
            </div>
            <div className="data">
              <p>ยอดรวม</p>
              <p id="fill1">฿<CountUp start={0} end={totalPrice} duration={2} decimals={2}/></p>
            </div>
            <div className="data">
              <p>ส่วนลด</p>
              <p id="fill1">฿<CountUp start={0} end={discount} duration={2}  decimals={2}/></p>
            </div>
            <div className="data">
              <p>ยอดรวม</p>
              <p id="fill1">฿<CountUp start={0} end={finalPrice} duration={2} decimals={2} /></p>
            </div>
            <div className="submit">
              <button id="checkout" onClick={handleCheckout}>
                สั่งซื้อ
              </button>
            </div>
             
             
          </div>
                </motion.div>
           </AnimatePresence>
          {/* for popup */}
          {usepopup && (
            <div className="overlay">
              <div className="pop_content">
                <div className="toppic">
                 คำสั่งซื้อ
                </div>
                <div className="scole-item">
                  {selectedProducts.map((item, index) => (
                    <div className="productshow" key={index}>
                <table>
                    <tbody>
                        <tr>
                            <td className="detail-sub" >สินค้า</td>
                            <td>{item.productName}</td>
                        </tr>
                        <tr>
                            <td className="detail-sub" >จำนวน</td>
                            <td>{item.quantity} ชิ้น</td>
                        </tr>
                        <tr>
                            <td className="detail-sub">ราคาต่อชิ้น</td>
                            <td>{formatNumber(item.price)} บาท</td>
                        </tr>
                        <tr>
                            <td className="detail-sub">ราคารวม</td>
                            <td>{formatNumber(item.price)} x {item.quantity} = {formatNumber(item.price*item.quantity)} บาท</td>
                        </tr>
                       
                    </tbody>
                </table>
                    </div>
                  ))}
                </div>
                <div className="totalprice">
            
                      <td>ส่วนลด : </td>
                      {formatNumber(discount)}
                  </div>
                      <div className="totalprice">
            
                        <td>Totalprice : </td>
                        {formatNumber(finalPrice)}
                      </div>
                  
                      <div className="conaddall">
                        <div className="detail-sub">ที่อยู่</div> 
                            <div className="address-box">
                                {addressElement}
                            </div>
                      </div>
                            
                        
              <div className="controll-button">
                 <button className="cancel-button" onClick={() => setUsePopup(false)}>ยกเลิก</button>
                 
                <button className="confirm-button" onClick={createOrderFromCart}>ยืนยันคำสั่งซื้อ</button>
              </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-cart">
          <p></p>
        </div>
      )}
    </div>
  );
}

export default Summary;
