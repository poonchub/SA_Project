import React, { useEffect, useState, useMemo } from 'react';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, message, Table, TableProps } from 'antd';  // นำเข้า Table จาก Ant Design
import './OwnerProfile.css';  
import { OwnerInterface } from '../../Interfaces/IOwner';
import { apiUrl, GetOwnerByID, GetOrders, UpdateOrder, UpdatestatusOrderbyID, GetslipByOrderID } from '../../services/http';
import Header from '../../components/ProductMangement/Header';
import { OrderInterface } from '../../Interfaces/IOrder';
import { PaymentInterface } from '../../Interfaces/IPayment';


const OwnerProfile: React.FC = () => {
  const [owner, setOwner] = useState<OwnerInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [useslip,setUseslip] = useState(false)
  const [payment,setPayment] = useState<PaymentInterface[]>([]);

  async function getOrders() {
    try {
      const res = await GetOrders();
      setOrders(res);
    } catch (err) {
      setError('Failed to fetch order data.');
    } finally {
      setLoading(false);
    }
  
  }
  async function getslipfrompament(id:number) {
    try{
        const res = await GetslipByOrderID(id)
        setPayment(res)
        setUseslip(true)
        console.log("id:", res[0].SlipPath);
    }catch (err){
      setError("fail fetch image")
    }
  }
  

  async function getOwner() {
    try {
      const res = await GetOwnerByID(1);
      setOwner(res);
    } catch (err) {
      setError('Failed to fetch owner data.');
    } finally {
      setLoading(false);
    }
  }

  const handleOrderDetail = (orderId: number) => {
    console.log(`Order ID: ${orderId}`);
    //ลิ้งไปหน้ารายละเอียดของคำสั่งซื้อ
  };
  const confirmOrder = async (id: number) => {
    const UpdateStatusOrder: OrderInterface = {
      Status: "paid"
      
    };
  
    try {
      const res = await UpdatestatusOrderbyID(UpdateStatusOrder, id);
      if (res) {
        console.log("Order status updated successfully", res);
        message.open({
          type:"success",
          content:"confirm เรียบร้อย",
          duration: 2,
        } );
        getOrders();
      } else {
        console.log("Failed to update order status");
      }
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };
  

  useEffect(() => {
    getOwner();
    getOrders();
   
  }, []);

  const profileImageUrl = useMemo(() => {
    return localStorage.getItem("profilePath") !== "" ? `${apiUrl}/${localStorage.getItem("profilePath")}` : '/images/account-black.png';
  }, [owner]);
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const columns: TableProps<OrderInterface>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: 'Total Price',
      dataIndex: 'TotalPrice',
      key: 'TotalPrice',
      render: (text: number) => `฿${formatPrice(text)}`, // แสดงราคาในรูปแบบที่มีคอมม่า
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
    },
  

    {
      title: 'Order Date',
      dataIndex: 'CreatedAt',
      key: 'CreatedAt',
      render: (text: string) => new Date(text).toLocaleString(), // แปลงวันที่ให้เป็นรูปแบบที่อ่านง่าย


    },
    {
      title: 'ดูรายละเอียด',
       render: (_,record:OrderInterface) =>  <button  id ='but-detail' onClick={()=>handleOrderDetail(Number(record.ID))}>ดูรายละเอียด</button>,
    },
    {
      title: 'ยืนยันคำสั่งซื้อ',
       render: (_,record:OrderInterface) =>  <button  id ='but-confirm-order' onClick={()=>confirmOrder(Number(record.ID))}>Confirm Order</button>,
    },
    {
      title: 'Slip',
       render: (_,record:OrderInterface) =>  <button  id ='but-preview-slip' onClick={()=>getslipfrompament(Number(record.ID))} >ดู slip</button>,
    },

  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header page={"profile"} />
      
      <div className="profile-container">
        <div className="all-content-for-admin">
      
         <div className="content-left-for-owner">
          <div className="image-cover">
          <div className="image-container"id='profile-owner'>
          <img
            src={profileImageUrl}
            className="circular-image"
            alt="Owner Profile"
            
          />
           </div>
        </div>
        <div className="cover-table">
          <table>
          <tbody>
            <tr>
              <td>
                <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
              </td>
              <td valign='bottom'>
                {owner?.FirstName} {owner?.LastName}
              </td>
            </tr>
            <tr>
              <td>
                <MailOutlined style={{ padding:'2px' ,fontSize: '25px', color: '#FF2E63' }} />
              </td>
              <td>{owner?.Email}</td>
            </tr>
            <tr>
              <td>
                <div className="img-custom">
                  <img id="img-cup" src='https://cdn0.iconfinder.com/data/icons/3d-dynamic-color/512/takeaway-cup-dynamic-color.png' alt="Admin Role"/>
                </div>
              </td>
              <td>
                {owner?.AdminRole}
              </td>
            </tr>
          </tbody>
        </table>
        
        </div>
        <div className="comtroll-but">
          <input type='button' value='จัดการบิล' className='btn-logout'
          onClick={() => window.location.href = '/ProductManagement'} />
        </div>
        
         </div>

         {/* ตารางสำหรับแสดงข้อมูล orders โดยใช้ Ant Design */}
         <div className="table-for-show-order">
           <h3 id='order-head'>Orders</h3>
           <Table<OrderInterface>
             columns={columns}
             dataSource={orders}
             rowKey="ID"  // กำหนด key ให้กับแต่ละ row
           />
         </div>
       
         </div>
      </div>
      {/* popup preview picture slip */}
      {
        useslip && (
          <div className="back-slip" onClick={()=>setUseslip(false)}>
            <div>
                  <img src={apiUrl + '/'+ payment[0].SlipPath || ''} alt="" id='slip-image' />
            </div>

          </div>
        )
      }
    </>
  );
};

export default OwnerProfile;
