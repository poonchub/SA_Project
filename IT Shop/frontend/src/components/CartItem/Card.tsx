import "../CartItem/Card.css";
import Close from "./image/close.png"
import Empty from "../Empty/Empty";
import { useEffect, useState } from "react";
import { CartInterface } from "../../Interfaces/ICart";
import { apiUrl, DeleteCart, GetCart, UpdateQuantity } from "../../services/http";
import { message, Button } from 'antd';

import { useNavigate } from 'react-router-dom';

export const formatNumber = (value: number): string => {
  // ปัดเป็นจำนวนเต็ม
  const roundedValue = Math.round(value);
  
  // ใช้ Intl.NumberFormat เพื่อคั่นหลักพันด้วย comma
  return new Intl.NumberFormat().format(roundedValue);
};




interface ShowlistProps {
  onCartDataChange: (data: CartInterface[] | null) => void;
  onSelectedItemsChange: (selectedItems: number[]) => void;
}

function Card({ onCartDataChange, onSelectedItemsChange }: ShowlistProps) {
  const [data, setData] = useState<CartInterface[] | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // แจ้งข้อความ
  const [messageApi, contextHolder] = message.useMessage();
  const [hasNotified, setHasNotified] = useState(false);
  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'ล้างตะกร้าสินค้าเรียบร้อยแล้ว',
      className: 'custom-class',
      style: {
        marginTop: '10px', // แก้ไขจาก '10h' เป็น '10px'
      },
    });
  };
  const success1 = () => {
    messageApi.open({
      type: 'success',
      content: 'ลบสินค้าออกจากตะกร้าสินค้าเรียบร้อยแล้ว',
      duration: 2,
    });
  };
  const fetchCartData = async () => {
    try {
      const cus_id = localStorage.getItem("id");
      const res = await GetCart(Number(cus_id));
      if (res && Array.isArray(res.data)) {
        // กำหนดประเภทของ item เป็น CartInterface
        const itemsWithStock = res.data.filter((item: CartInterface) => item.Product.Stock !== 0);
        const itemsToRemove = res.data.filter((item: CartInterface) => item.Product.Stock === 0);
        
        setData(itemsWithStock);
        onCartDataChange(itemsWithStock);
  
        // ลบสินค้าที่ Stock เป็น 0
        if (itemsToRemove.length > 0) {
          await Promise.all(itemsToRemove.map((item: CartInterface) => DeleteCart(item.ID)));
          console.log("Items removed successfully.");
  
          if (!hasNotified) {
            message.warning("มีสินค้าถูกลบออกจากตะกร้าเนื่องจากสินค้าหมดแล้ว");
            setHasNotified(true);
           
            
          }
        } else {
          setHasNotified(false);
        }
        
      } else {
        console.error("Unexpected response type:", res);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

   
  const handleSelectAll = () => {
    if (data) {
      const allIds = data.map(item => item.ID || 0);
      setSelectedItems(allIds);
      onSelectedItemsChange(allIds);
    }
  };

  const DeleteAllCart = async () => {
    if (data && data.length > 0) {
      try {
        const allIds = data.map(item => item.ID);
        await Promise.all(allIds.map(id => DeleteCart(id || 0)));
        success();
        fetchCartData();
      } catch (error) {
        console.error("Error deleting all cart items:", error);
      }
    }
  };



  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id];

      onSelectedItemsChange(updatedItems);
      return updatedItems;
    });
  };

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    try {
      await UpdateQuantity(data || [], id, newQuantity);
      fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleDeleteCart = async (id: number) => {
    try {
      await DeleteCart(id);
      success1();
      fetchCartData();
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };



  return (
    <div className="container-showcartitem">


 
          {contextHolder}
          
      {data && data.length > 0 ? (
        <>
        
         
          <div className="select-acction">
            <Button type="primary" id="select-all" onClick={handleSelectAll}>เลือกทั้งหมด</Button>    
           <Button type="primary" id="delete-all" onClick={DeleteAllCart}>ลบทั้งหมด</Button> 
       
           
          </div>
          <div className="card-container-item" id="all-item">

            {/* <div id="scole-item"> */}
          {data.map((item, index) => (
            <div key={index}>
              
              <div className="card" >
                <div className="check-item-incart">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.ID || 0)}
                      onChange={() => handleCheckboxChange(item.ID || 0)}
                    />
                    <span className="checkbox"></span>
                  </label>
                </div>
                <div className="image">
                  <img
                    src={apiUrl + "/"+item.Product.Image[0].FilePath || ""}
                    alt=""
                    id='model'
                  />
                </div>
                <div className="description">
                  <div className="name">
                 {item.Product.ProductName}
                  </div>
                  <div className="mon">
                  ฿ {formatNumber(item.Product?.PricePerPiece || 0)}
                  </div>

                </div>
                <div className="quantity">
                  <div id="box-crop">
                    <div className="minus">
                      <button
                          onClick={() => handleUpdateQuantity(item.ID || 0, Number(item.Quantity || 1) - 1)}
                          disabled={Number(item.Quantity || 1) <= 1}
                      >-</button>
                    </div>
                    <div className="value">
                      <p>{item.Quantity}</p>
                    </div>
                    <div className="plus">
                      <button
                        onClick={() => handleUpdateQuantity(item.ID || 0, Number(item.Quantity||1) + 1)}
                        disabled={(item.Product.Stock || 0) < (Number(item.Quantity||1) + 1)}
                      >+</button>
                    </div>
                  </div>
                    
                  </div>
                <div className="delete">
                  <button onClick={() => handleDeleteCart(item.ID || 0)} id="move">
                    <img src={Close} alt="" id='close'/>
                  </button>
                </div>
              </div>
            </div>
          ))}

              {/* </div> */}
          {/* //card container */}
          </div> 
        </>
      ) : (
        <Empty />
      )}     
    </div>
  );
}

export default Card;
