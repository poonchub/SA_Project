import React, { useEffect, useRef, useState } from 'react';
import '../AmountPrice/AmountPrice.css';
import uploadPhoto from '../../assets/Upload_Button.svg';
import '../OrderShow/OrderShow.css';
import { Button, Card, Flex, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import QRcode from '../../../../backend/images/payment/QR.png';
import { UpdatePaymentSlip, DeleteOrderByID, GetOrderItemByOrderID, UpdateProduct } from '../../services/http';
import PopupConfirmPayment from './PopupConfirmPayment';
import { useNavigate } from 'react-router-dom';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ProductInterface } from '../../Interfaces/IProduct';
import { GetProductByID } from '../../services/http';
import PopupCancelPayment from './PopupCancelPayment';
import Umaru from '../../assets/Umaru-Smail.gif';
import UmaruCry from '../../assets/Umaru-Cry.gif';
import promptpay from '../../assets/promptpay.jpg';

const AmountPriceEdit = ({ orderId, customerId }: { orderId: number, customerId: number }) => {
  const [slip, setSlip] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [api, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [products, setProducts] = useState<{ [key: number]: ProductInterface }>({});
  // const [existingSlip, setExistingSlip] = useState<string[]>([]); // New state for existing slip

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

  // useEffect(() => {
  //   const fetchExistingSlip = async () => {
  //     try {
  //       const paymentData = await GetOrderByID(orderId);
  //       if (paymentData && paymentData.Slip) {
  //         setExistingSlip([paymentData.Slip]); // Assuming Slip contains the URL or path to the existing slip image
  //         // Store the existing payment ID if needed
  //         // setExistingPaymentId(paymentData.id); // if there's an ID returned
  //       }
  //     } catch (error) {
  //       console.error('Error fetching existing slip:', error);
  //     }
  //   };
  
  //   fetchExistingSlip();
  // }, [orderId]);
  

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
      formData.append('SlipPath', file);
    });
    console.log(formData);
    try {
      // Call UpdatePaymentSlip with the payment ID and formData
      // Here, ensure you use the correct existing payment ID.
      const paymentIdToUpdate = orderId; // Change this if you have a different payment ID
      const res = await UpdatePaymentSlip(paymentIdToUpdate, formData);
  
      // Check if the response is valid
      if (res) {
        api.success({
          content: 
            <div className='custom-success-message'>
              <span style={{marginTop: '10px', marginRight: '20px'}}>ชำระเงินเสร็จสิ้น กรุณารอการตรวจสอบจากทางเราค่ะ</span>
              <img src={Umaru} alt="success" style={{ width: '100px', marginRight: '10px', borderRadius: '15%' }} />
            </div>,
          duration: 4.5,
        });
        setTimeout(() => {
          navigate('/Profile'); // เปลี่ยนเส้นทางไปที่ /Profile
        }, 5000);
      } else {
        api.error('Failed to upload images. Please try again.');
      }
    } catch (error) {
      api.error('Error uploading images. Please try again.');
    }
  };

  const setCancel = async () => {
    setShowCancelPopup(true);
  }

  const handleCancelOrder = async () => {
    setShowCancelPopup(false); // เปิด Popup
    try {
      if (orderItems.length > 0) {
        const isDeleted = await DeleteOrderByID(orderId);
        
        if (isDeleted) { // ตรวจสอบว่าการลบคำสั่งซื้อสำเร็จ
          const updatePromises = orderItems.map(async (item: OrderItemInterface) => {
            const productID = item.ProductID; // ดึง ProductID
            if (typeof productID === 'number') {
              const currentStock = products[productID]?.Stock || 0; // ใช้ผลิตภัณฑ์ที่ดึงมา
              const updatedProductData: ProductInterface = {
                Stock: (currentStock || 0) + (item.Quantity || 0), // เพิ่มสต็อกตามจำนวนที่ถูกยกเลิก
              };
              return UpdateProduct(productID, updatedProductData);
            } else {
              api.error('ไม่พบข้อมูลสินค้า');
              return false; // ส่งค่าผลลัพธ์เป็น false
            }
          });
  
          const updateResults = await Promise.all(updatePromises);
          const allSuccess = updateResults.every((result: boolean) => result);
  
          if (allSuccess) {
            api.success({
              content: 
                <div className='custom-success-message'>
                  <span style={{marginTop: '20px', marginRight: '20px'}}>ว้าาเสียดายจัง ไม่ยกเลิกได้ไหมอ้าา~~</span>
                  <img src={UmaruCry} alt="success" style={{ width: '100px', marginRight: '10px', borderRadius: '15%' }} />
                </div>,
              duration: 4.5,
            });
            setTimeout(() => {
              navigate('/Profile'); // เปลี่ยนเส้นทางไปที่ /Profile
            }, 5000);
          } else {
            api.error('ไม่สามารถอัปเดตสินค้าได้ครบทุกตัว');
          }
        } else {
          api.error('ไม่สามารถยกเลิกคำสั่งซื้อได้');
        }
      } else {
        api.error('ไม่พบรายการสินค้าในคำสั่งซื้อ');
      }
    } catch (error) {
      console.error('Error while cancelling order:', error);
      api.error('เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ');
    }
  };

  const cancelUpload = () => {
    setShowConfirmPopup(false);
  };

  const cancelCancelOrder = () => {
    setShowCancelPopup(false);
  };


  return (
    <div>
      {contextHolder}

      <Card className="custom-cardAM">
        <div className='upload-container'>
          <center style={{ fontSize: '16px' }}>
            <h2>
              <p>บริษัท <span style={{color: '#fa3869', marginBottom: '15px'}}>SHOENG LEUK</span> จำกัด</p>
            </h2> 
            <img className='myimage' src={QRcode} alt="" />
            <span>
              <h4>
                <p style={{marginTop: '10px'}}> <img src={promptpay}
                          style={{
                            width: '100px',
                            borderRadius: '50%',
                            display: 'flex',

                          }}
                /><p style={{marginTop: '10px'}}>แสกนจ่ายอย่างรวดเร็วด้วยพร้อมเพย์</p></p>
                
              </h4>
            </span>
            
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
        <button className="btn" style={{marginTop: '7px'}} id="Cancel-button" onClick={setCancel}>
          ยกเลิกคำสั่งซื้อ
        </button>
      </Card>

      <PopupCancelPayment
        visible={showCancelPopup}
        onConfirm={handleCancelOrder}
        onCancel={cancelCancelOrder}
      />

      <PopupConfirmPayment
        visible={showConfirmPopup}
        onConfirm={confirmUpload}
        onCancel={cancelUpload}
      />

      {/* <PopupPaymentThx
        visible={showThxPopup}
        onConfirm={PaymentSuccessfull}
        onCancel={cancelUpload}
      /> */}
    </div>
  );
};

export default AmountPriceEdit;


