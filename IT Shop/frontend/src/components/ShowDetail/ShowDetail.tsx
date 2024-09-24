import { useContext, useEffect, useState } from "react";
import "./ShowDetail.css"
import { AddToCart, GetCart, ListProducts} from "../../services/http";
import { ProductInterface } from "../../Interfaces/IProduct";
import { message } from "antd";
import { PopupContext } from "../../pages/Selected";
import PopupConfirmOrder from "../PopupConfirmOrder/PopupConfirmOrder";
//for countCart
import { AppContext } from '../../App';
import Minus from "../Header/image-for-logo/min (1) (1).png"
import Plus from "../Header/image-for-logo/plus (1).png"
function ShowDetail(){

    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [messageApi, contextHolder] = message.useMessage();
    const {setPopup} = useContext(PopupContext)

    //for countCart
    const { setCountCart } = useContext(AppContext);

    async function getProducts(){
        let res = await ListProducts()
        if (res) {
            setProducts(res);
        }
    }

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

    function showPopup(){
        setPopup(<PopupConfirmOrder setPopup={setPopup} productName={productName} price={price} quantity={quantity} products={products} messageApi={messageApi}/>)
    }

    useEffect(()=> {
        getProducts()
    }, [])

    const sltProductStr = localStorage.getItem("sltProduct")
    const sltProduct = sltProductStr!=null ? parseInt(sltProductStr) : 0;

    // @ts-ignore
    const productName = products.length > 0 ? products[sltProduct].ProductName : '';
    // @ts-ignore
    const brand = products.length > 0 ? products[sltProduct].Brand.BrandName : '';
    // @ts-ignore
    const stock = products.length > 0 ? products[sltProduct].Stock : '';
    // @ts-ignore
    const price = products.length > 0 ? products[sltProduct].PricePerPiece.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00';
    // @ts-ignore
    const description = products.length > 0 ? products[sltProduct].Description : '';
    // @ts-ignore
    const wordsArray = description.split("\n");

    const desElement = wordsArray.map((words, index) => {
        const w = words.trim().split("\t")
        return (
            <tbody key={index}>
                <tr>
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
            </tbody>  
        )
    })

   // funtion add to cart
   const success = () => {
    messageApi.open({
      type: 'success',
      content: 'เพิ่มสินค้าเข้าตะกร้าสินค้าเรียบร้อยแล้ว',
      duration: 2,
    });
  };
   const handleAddToCart = async (pid: number, quantity: number) => {
    const cid  = Number(localStorage.getItem("id")) 
    try {
      const result = await AddToCart(cid, pid, quantity);
      if (result) {
        console.log('Product added to cart successfully');
        success()
        fetchCartData();

      } else {
        
        messageApi.open({
          type: 'error',
          content: 'เกิดข้อผิดพลาดในการเพิ่มสินค้าในตะกร้า',
          duration: 2,
        })
        console.error('Failed to add product to cart');
      }
    } catch (error) {
    messageApi.open({
      type: 'error',
      content: 'เกิดข้อผิดพลาดในการเพิ่มสินค้าในตะกร้า',
      duration: 2,
    })
      console.error('Error adding product to cart:', error);
    }
  };  
  const fetchCartData = async () => {
    const cus_id = Number(localStorage.getItem("id"));
    const res = await GetCart(cus_id);
    if (res && Array.isArray(res.data)) {
      setCountCart(res.data.length); // อัพเดต countCart ใน AppContext
    }
  };

  useEffect(() => {
    fetchCartData(); // ดึงข้อมูลเมื่อหน้าโหลด
  }, []);
    //end for cart




    return (
        <div className="showdetail-container">
            {contextHolder}
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
                        <img src={Minus}  id="decrease"/>
                    </div>
                    <span className="num-of-quantity">
                        {quantity}
                    </span>
                    <div className="quantity-btn" id="add-button" onClick={add}>
                        {/* + */}
                        <img src={Plus}  id="increase"/>
                    </div>
                </div>
                <div className="button-box">
                    <div className="btn" id="cart-button" onClick={() => handleAddToCart(sltProduct+1, quantity)}>
                        เพิ่มลงตะกร้า
                    </div>
                    <div className="btn" id="order-button" onClick={showPopup}>
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