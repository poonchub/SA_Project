import React, { useEffect, useRef, useState } from 'react';
import '../AmountPrice/AmountPrice.css';
import uploadPhoto from '../../assets/Upload_Button.svg';
import '../OrderShow/OrderShow.css';
import { Button, Card, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import QRcode from '../../../../backend/images/payment/QR.png';
import { CreatePayment, DeleteOrderByID, GetOrderItemByOrderID, UpdateProduct } from '../../services/http'; // เรียกใช้ฟังก์ชัน DeleteOrderByID และ UpdateProduct
import PopupConfirmPayment from './PopupConfirmPayment';
import { useNavigate } from 'react-router-dom';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ProductInterface } from '../../Interfaces/IProduct';
import { GetProductByID } from '../../services/http';

const AmountPrice = ({ orderId, customerId}: { orderId: number, customerId: number}) => {
  const [slip, setSlip] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [api, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [products, setProducts] = useState<{ [key: number]: ProductInterface }>({});


  useEffect(() => {
    const fetchOrderItems = async () => {
      try {
        const fetchedOrderItems = await GetOrderItemByOrderID(orderId);
        setOrderItems(fetchedOrderItems);
      } catch (error) {
        console.error('Error fetching order items:', error);
      }
    };
    fetchOrderItems();
  }, [orderId]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts: { [key: number]: ProductInterface } = {};

      await Promise.all(
        orderItems.map(async (item) => {
          if (item.ProductID) {
            const product = await GetProductByID(item.ProductID);
            if (product) {
              fetchedProducts[item.ProductID] = product;
            }
          }
        })
      );

      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, [orderItems]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  const handleSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSlip((prevSlip) => [...prevSlip, ...fileArray]);
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowWarning(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setSlip((prevSlip) => {
      const newSlip = [...prevSlip];
      newSlip.splice(index, 1);
      return newSlip;
    });
    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (slip.length === 0) {
      api.error('กรุณาอัปโหลดสลิปก่อน');
      setShowWarning(true);
      return;
    }
    setShowConfirmPopup(true);
  };

  const confirmUpload = async () => {
    setShowConfirmPopup(false);
    const formData = new FormData();
    slip.forEach((file) => {
      formData.append('slip', file);
    });
    formData.append('customerID', customerId.toString());
    formData.append('orderID', orderId.toString());

    try {
      const res = await CreatePayment(formData);
      if (res) {
        api.success('ชำระเงินเสร็จสิ้น กรุณารอการตรวจสอบจากทางเราค่ะ');
        setTimeout(() => {
          navigate('/Profile'); // เปลี่ยนเส้นทางไปที่ /Profile
        }, 1000);
      } else {
        api.error('Failed to upload images. Please try again.');
      }
    } catch (error) {
      api.error('Error uploading images. Please try again.');
    }
  };

  const handleCancelOrder = async () => {
    try {
      if (orderItems.length > 0) {
        // เริ่มทำการยกเลิกคำสั่งซื้อ
        const isDeleted = await DeleteOrderByID(orderId);
        
        if (isDeleted) { // ตรวจสอบว่าการลบคำสั่งซื้อสำเร็จ
          const updatePromises = orderItems.map(async (item: OrderItemInterface) => {
            const productID = item.ProductID; // ดึง ProductID
            console.log(productID);
  
            if (typeof productID === 'number') {
              const currentStock = products[productID]?.Stock || 0; // ใช้ผลิตภัณฑ์ที่ดึงมา
              const updatedProductData: ProductInterface = {
                Stock: (currentStock || 0) + (item.Quantity || 0), // เพิ่มสต็อกตามจำนวนที่ถูกยกเลิก
              };
  
              // อัปเดตสต็อกของสินค้า
              return UpdateProduct(productID, updatedProductData);
            } else {
              api.error('ไม่พบข้อมูลสินค้า'); // หาก productID ไม่ถูกต้อง
              return false; // ส่งค่าผลลัพธ์เป็น false
            }
          });
  
          const updateResults = await Promise.all(updatePromises);
          const allSuccess = updateResults.every((result: boolean) => result);
  
          if (allSuccess) {
            api.success('คำสั่งซื้อถูกยกเลิกและสินค้าได้ถูกอัปเดตเรียบร้อยแล้วค่ะ');
            setTimeout(() => {
              navigate('/Profile'); // เปลี่ยนเส้นทางไปที่ /Profile
            }, 1000);
          } else {
            api.error('ไม่สามารถอัปเดตสินค้าได้ครบทุกตัว');
          }
        } else {
          api.error('ไม่สามารถยกเลิกคำสั่งซื้อได้'); // แจ้งผู้ใช้ว่าการลบคำสั่งซื้อไม่สำเร็จ
        }
      } else {
        api.error('ไม่พบรายการสินค้าในคำสั่งซื้อ');
      }
    } catch (error) {
      console.error('Error while cancelling order:', error);
      api.error('เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ');
    }
  };
  

  
  
  
  
  
  

  return (
    <div>
      {contextHolder}

      <Card className="custom-cardAM">
        <div className='upload-container'>
          <center style={{ fontSize: '16px' }}>
            <img className='myimage' src={QRcode} alt="" />
            <p></p>
            <span>บริษัท ITShop จำกัด </span>
            ธนาคารกสิกรไทย
          </center>
          <div style={{ margin: -30 }}>
            <input
              type="file"
              id="fileInput"
              onChange={handleSlipChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="fileInput" style={{ position: 'relative', display: 'inline-block' }}>
              <img src={uploadPhoto} className='Upload-button' />
              {showWarning && (
                <div
                  className='warningUpload'
                  style={{
                    backgroundColor: '#FF0000',
                  }}
                />
              )}
            </label>

            {previews.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div>
                  {previews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                      <img className='preview'
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                      <Button
                        icon={<CloseOutlined />}
                        size="small"
                        shape="circle"
                        onClick={() => handleRemoveImage(index)}
                        className='removePreview'
                        style={{
                          position: 'absolute',
                          top: '-15px',
                          right: '-10px',
                          backgroundColor: 'red',
                          color: 'white',
                          stroke: 'red',
                          maskSize: '5px',
                          padding: '2px',
                          border: 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="btn" id="Confirm-button" onClick={handleUpload}>
          ตรวจสอบการชำระเงิน
        </button>

        {/* ปุ่มยกเลิกคำสั่งซื้อ */}
        <button className="btn" id="Cancel-button" onClick={handleCancelOrder}>
          ยกเลิกคำสั่งซื้อ
        </button>
      </Card>

      <PopupConfirmPayment
        visible={showConfirmPopup}
        onConfirm={confirmUpload}
        onCancel={handleCancelOrder}
      />
    </div>
  );
};

export default AmountPrice;
