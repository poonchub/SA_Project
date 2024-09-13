import "../CartSummary/Summary.css";
import { CartInterface } from "../../Interfaces/ICart";
import { DeleteCart } from "../../services/http"; // นำเข้า API สำหรับลบสินค้า
import { formatNumber } from "../CartItem/Card";
import CountUp from "react-countup";


interface TotalPriceProps {
  cartItems: CartInterface[] | null;
  selectedItems: number[];
  onCartUpdate: () => void;  // เพิ่ม props เพื่ออัปเดตข้อมูล cart
}

function Summary({ cartItems, selectedItems, onCartUpdate }: TotalPriceProps) {
  // คำนวณยอดรวม
  const calculateTotalPrice = () => {
    if (!cartItems) return 0;
    
    return cartItems
      .filter((item) => selectedItems.includes(item.ID || 0)) // เลือกเฉพาะสินค้าที่ถูกเลือก
      .reduce((total, item) => {
        
        return (total + item.Product.PricePerPiece * Number(item.Quantity)) ;
      }, 0);
  };
  const calculateDiscount = (total: number) => {
    return total >= 1000 ? 500 : 0;
  };
  // ฟังก์ชันสำหรับการกดปุ่มชำระเงิน
  const handleCheckout = async () => {
    if (!cartItems) return;

    const selectedProducts = cartItems
      .filter((item) => selectedItems.includes(item.ID || 0)) // เลือกเฉพาะสินค้าที่ถูกเลือก
      .map((item) => ({
        id: item.ID,
        p_id: item.Product.ID,
        productName: item.Product.ProductName,
        quantity: item.Quantity,
        totalPrice: item.Product.PricePerPiece * Number(item.Quantity),
      }));

    // แปลงข้อมูลเป็น JSON แล้วแสดงผลใน console
    console.log(JSON.stringify(selectedProducts, null, 2));

    // ลบสินค้าที่ถูกเลือกออกจาก cart
    for (const item of selectedProducts) {
      await DeleteCart(item.id); // เรียกใช้ API สำหรับลบสินค้า
    }

    // อัปเดตข้อมูล cart หลังจากลบสินค้า
    onCartUpdate();
  };

  const totalPrice = calculateTotalPrice();
  const discount = calculateDiscount(totalPrice);
  const finalPrice = totalPrice - discount;

  return (
    
    <div className="summary-container">
      {cartItems && cartItems.length > 0 ? (
        <>
        <div className="Summary">
          <div className="sum-topic">
            <p>Summary</p>
          </div>
          <div className="under">
            <hr />
          </div>
          <div className="data">
            <p>ยอดรวม</p>
           
            <p id="fill1">฿<CountUp start={0} end={totalPrice} duration={2} /></p>
          
          </div>
          <div className="data">
            <p>ส่วนลด</p>
            <p id="fill1">฿<CountUp start={0} end={discount} duration={2} /></p>
          </div>
          <div className="data">
            <p>ยอดรวม</p>
            <p id="fill1">฿<CountUp start={0} end={finalPrice} duration={2} /></p>
          
          </div>
          <div className="submit">
            <button id="checkout" onClick={handleCheckout}>
              ชำระเงิน
            </button>
          </div>
        </div><>
          </>
          </>) : (
        <div className="empty-cart">
          <p></p>
        </div>
      )}
      
    </div>
  );
}

export default Summary;
