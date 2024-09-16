import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { CartInterface } from "../Interfaces/ICart";
import { GetCart } from "../services/http";
import TopicCart from "../components/CartTopic/Topic";
import Card from "../components/CartItem/Card";
import Summary from "../components/CartSummary/Summary";

//for Countcart
import { AppContext } from '../App'; // ดึง AppContext มาใช้

function Cart(){
    const [cartData, setCartData] = useState<CartInterface[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [icon, setIcon] = useState("/images/icon/Hamburger.png");
  
  //for Countcart
  const { setCountCart } = useContext(AppContext); // ดึง setCountCart จาก AppContext
  const handleCartUpdate = () => {
    // เรียกฟังก์ชัน fetchCartData เพื่อดึงข้อมูลล่าสุดจาก server
    fetchCartData();
  };

  // ฟังก์ชันดึงข้อมูล cart
  const fetchCartData = async () => {
    const cus_id = Number(localStorage.getItem("id"));
    const res = await GetCart(cus_id);
        if (res && Array.isArray(res.data)) {
          setCartData(res.data);
           // ส่งข้อมูลตะกร้าไปยัง App
          
        } else {
            console.error("Unexpected response type:", res);
        }
  };



  // อัพเดต countCart ทุกครั้งที่ cartData เปลี่ยนแปลง
  useEffect(() => {
    if (cartData) {
      setCountCart(cartData.length); // อัพเดตจำนวนสินค้าตะกร้าใน AppContext
    }
  }, [cartData, setCountCart]); // ทำงานทุกครั้งที่ cartData เปลี่ยนแปลง

  useEffect(() => {
    fetchCartData();
  }, []);
  console.log(cartData?.length)


    return (
        <>
             <Header page={"cart" } /> 
            
                     <TopicCart />
                      <Card onCartDataChange={setCartData} onSelectedItemsChange={setSelectedItems}/>
                     <Summary cartItems={cartData} selectedItems={selectedItems} 
                    onCartUpdate={handleCartUpdate}/>  
        </>
    )
}

export default Cart;