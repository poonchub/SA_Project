import React, { useEffect, useRef, useState } from 'react';
import '../AmountPrice/AmountPrice.css';
import uploadPhoto from '../../assets/Upload_Button.svg';
import '../OrderShow/OrderShow.css';
import { Button, Card, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import QRcode from '../../../../backend/images/payment/QR.png';
import { CreatePayment } from '../../services/http';
import PopupConfirmPayment from './PopupConfirmPayment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AmountPrice = ({ orderId, customerId }: { orderId: number, customerId: number }) => {
  const [slip, setSlip] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]); // เก็บ URL ของรูป preview
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // สถานะของ popup
  const [showWarning, setShowWarning] = useState(false); // สถานะของจุดเตือน
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ใช้ ref เพื่อเข้าถึง input ของไฟล์
  const [api, contextHolder] = message.useMessage(); // ใช้ message API
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง
  

  useEffect(() => {
    // Clean up URLs when component unmounts or slip changes
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

      // เพิ่มไฟล์ใหม่ในรายการไฟล์ที่มีอยู่แล้ว
      setSlip((prevSlip) => [...prevSlip, ...fileArray]);

      // สร้าง preview ของไฟล์ที่อัปโหลด (เฉพาะรูปภาพ)
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);

      // รีเซ็ตค่า input เพื่อให้สามารถเพิ่มไฟล์เดิมได้อีกครั้ง
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input to allow re-uploading the same file
      }

      // ซ่อนจุดเตือนเมื่อมีการอัปโหลดไฟล์
      setShowWarning(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    // ลบ preview URL เมื่อรูปถูกลบออก
    URL.revokeObjectURL(previews[index]);

    // ลบรูปตาม index
    setSlip((prevSlip) => {
      const newSlip = [...prevSlip];
      newSlip.splice(index, 1); // ลบไฟล์ตาม index
      return newSlip;
    });

    setPreviews((prevPreviews) => {
      const newPreviews = [...prevPreviews];
      newPreviews.splice(index, 1); // ลบ preview ตาม index
      return newPreviews;
    });

    // รีเซ็ต input ทุกครั้งหลังการลบเพื่อให้สามารถอัปโหลดรูปใหม่ได้
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (slip.length === 0) {
      // ถ้ายังไม่ได้อัปโหลดไฟล์ ให้แสดงข้อความเตือนและจุดเตือน
      api.error('กรุณาอัปโหลดสลิปก่อน');
      setShowWarning(true); // แสดงจุดเตือน
      return;
    }

    setShowConfirmPopup(true); // แสดง popup confirm
  };

  const confirmUpload = async () => {
    setShowConfirmPopup(false); // ซ่อน popup confirm

    const formData = new FormData();
    slip.forEach((file) => {
      formData.append('slip', file);
    });
    formData.append('customerID', customerId.toString());
    formData.append('orderID', orderId.toString());

    try {
      const res = await CreatePayment(formData);
      if (res) {
        api.success('ชำระเงินเสร็จสิ้น'); // แสดงข้อความสำเร็จ
        setTimeout(() => {
          navigate(-1); // กลับไปยังหน้าก่อนหน้า
        }, 1000); // หน่วงเวลา 1 วินาที
      } else {
        api.error('Failed to upload images. Please try again.');
      }
    } catch (error) {
      api.error('Error uploading images. Please try again.');
    }
  };

  const cancelUpload = () => {
    setShowConfirmPopup(false); // ซ่อน popup confirm
  };

  return (
    <div>
      {contextHolder} {/* ใช้ message API */}

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
              style={{ display: 'none' }} // ซ่อน input
            />
            <label htmlFor="fileInput" style={{ position: 'relative', display: 'inline-block' }}>
              <img src={uploadPhoto} className='Upload-button' />
              {/* จุดเตือน */}
              {showWarning && (
                <div
                  className='warningUpload'
                  style={{
                    position: 'absolute',
                    top: '23px',
                    left: '347px',
                    backgroundColor: '#FF0000',
                  }}
                />
              )}
            </label>

            {/* แสดงตัวอย่างรูปที่อัปโหลด */}
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
                      {/* ปุ่มลบ */}
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
      </Card>

      {/* แสดง PopupConfirmPayment */}
      <PopupConfirmPayment
        visible={showConfirmPopup}
        onConfirm={confirmUpload}
        onCancel={cancelUpload}
      />
    </div>
  );
};

export default AmountPrice;
