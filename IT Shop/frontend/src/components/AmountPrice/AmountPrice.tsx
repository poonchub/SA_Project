import React, { useEffect, useRef, useState } from 'react';
import '../AmountPrice/AmountPrice.css';
import uploadPhoto from '../../assets/Upload_Button.svg';
import '../OrderShow/OrderShow.css';
import { Button, Card} from 'antd';
import { CloseOutlined} from '@ant-design/icons';
import QRcode from '../../../../backend/images/payment/QR.png';
import { CreatePayment } from '../../services/http';

function AmountPrice({ orderId, customerId }: { orderId: number, customerId: number }) {
  const [slip, setSlip] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState('');
  const [previews, setPreviews] = useState<string[]>([]); // เก็บ URL ของรูป preview
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ใช้ ref เพื่อเข้าถึง input ของไฟล์

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

  const handleUpload = async (e: React.FormEvent) => {
      e.preventDefault();

      const formData = new FormData();
      slip.forEach((file) => {
          formData.append('slip', file);
      });
      formData.append('customerID', customerId.toString());
      formData.append('orderID', orderId.toString());

      try {
          const res = await CreatePayment(formData);
          if (res) {
              setUploadMessage(res.message);
          } else {
              setUploadMessage("Failed to upload images. Please try again.");
          }
      } catch (error) {
          setUploadMessage("Error uploading images. Please try again.");
      }
  };




  return (
    <div>
      <Card className="custom-cardAM">
        <div className='upload-container'>
          <center style={{fontSize: '16px',}}>
            <img className='myimage' src={QRcode} alt="" />
            <p></p>
            <span>บริษัท ITShop จำกัด </span>
            ธนาคารกสิกรไทย
          </center>
        <div style={{margin: -30}}>
          <input
            type="file"
            id="fileInput"
            onChange={handleSlipChange}
            style={{ display: 'none' }} // ซ่อน input
          />
          <label htmlFor="fileInput" >
            <img src={uploadPhoto} className='Upload-button'/>
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
            {uploadMessage}
      </Card>
    </div>
  );
};

export default AmountPrice;
