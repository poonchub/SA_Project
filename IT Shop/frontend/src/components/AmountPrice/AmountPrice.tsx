import React, { useState } from 'react';
import '../AmountPrice/AmountPrice.css';
import edit from '../../assets/edit.svg';
import '../OrderShow/OrderShow.css';
import { Modal, Button, Upload, Card, message } from 'antd';
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import QRcode from '../../../../backend/images/payment/QR.jpg';
import '../../stylesheet/image.css';
import { CreatePayment } from '../../services/http';

const AmountPrice: React.FC<{ customerId: number, orderId: number }> = ({ customerId, orderId }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (fileList.length === 0) {
      message.error('กรุณาอัปโหลดสลิปก่อนยืนยันการชำระเงิน');
    } else {
      try {
        // Get the first file from fileList
        const file = fileList[0]?.originFileObj;

        if (file) {
          await CreatePayment(
            {
              CustomerID: customerId,
              OrderID: orderId,
              PaymentDate: new Date().toISOString(),
              PaymentMethod: 'Bank Transfer', // Example value
            },
            file
          );
          setIsModalVisible(false);
          setIsPaymentSuccess(true);
        } else {
          message.error('ไม่พบไฟล์สลิปที่อัปโหลด');
        }
      } catch (error) {
        message.error('เกิดข้อผิดพลาดในการชำระเงิน');
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const closeSuccessModal = () => {
    setIsPaymentSuccess(false);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  return (
    <div className="card-containerAM">
      <Card className="custom-cardAM">
        <p>
          <center>
            <img className='myimage' src={QRcode} alt="" />
          </center>
        </p>
        <Upload
          className='upload-center'
          onChange={handleUploadChange}
          fileList={fileList}
          beforeUpload={() => false} // Prevent automatic upload
        >
          <Button icon={<UploadOutlined />}>อัปโหลดสลิป</Button>
        </Upload>
        <div className="flex" style={{ display: 'flex', flexDirection: 'column', gap: 'small', width: '100%' }}>
          <div className="btn" id="Confirm-button" onClick={showModal}>
            ตรวจสอบการชำระเงิน
          </div>
        </div>
      </Card>

      {/* Modal for payment confirmation */}
      <Modal
        title="ยืนยันการชำระเงิน"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ตกลง"
        cancelText="ยกเลิก"
      >
        <p>คุณแน่ใจหรือไม่ว่าต้องการยืนยันการชำระเงิน?</p>
      </Modal>

      {/* Modal for payment success */}
      <Modal
        open={isPaymentSuccess}
        onOk={closeSuccessModal}
        okText="ปิด"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <div style={{ textAlign: 'center' }}>
          <CheckCircleOutlined style={{ fontSize: '64px', color: 'green' }} />
          <p style={{ marginTop: '20px', fontSize: '18px' }}>ชำระเงินสำเร็จ</p>
        </div>
      </Modal>
    </div>
  );
};

export default AmountPrice;
