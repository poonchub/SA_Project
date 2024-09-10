import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { CartInterface } from "../Interfaces/ICart";
import { GetCart } from "../services/http";
import TopicCart from "../components/CartTopic/Topic";
import Card from "../components/CartItem/Card";
import Summary from "../components/CartSummary/Summary";


function Cart(){
    const [cartData, setCartData] = useState<CartInterface[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [icon, setIcon] = useState("/images/icon/Hamburger.png");
  
  const handleCartUpdate = () => {
    // เรียกฟังก์ชัน fetchCartData เพื่อดึงข้อมูลล่าสุดจาก server
    fetchCartData();
  };

  // ฟังก์ชันดึงข้อมูล cart
  const fetchCartData = async () => {
    const res = await GetCart(1);
        if (res && Array.isArray(res.data)) {
          setCartData(res.data);
           // ส่งข้อมูลตะกร้าไปยัง App
        } else {
            console.error("Unexpected response type:", res);
        }
  };

  useEffect(() => {
    fetchCartData();
  }, []);
  



    return (
        <>
             <Header page={"cart"}/> 
            
            <TopicCart />
                      <Card onCartDataChange={setCartData} onSelectedItemsChange={setSelectedItems}/>
                     <Summary cartItems={cartData} selectedItems={selectedItems} 
                    onCartUpdate={handleCartUpdate}/>  
        </>
    )
}

export default Cart;