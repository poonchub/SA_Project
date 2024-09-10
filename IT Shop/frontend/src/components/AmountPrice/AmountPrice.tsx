import React, { useState } from 'react';
import '../AmountPrice/AmountPrice.css';
import edit from '../../assets/edit.svg'
import '../OrderShow/OrderShow.css';
import { Modal, Button, Upload, Card, message } from 'antd';
import { CheckCircleOutlined, UploadOutlined } from '@ant-design/icons';
import QRcode from '../../../../backend/images/payment/QR.jpg';
import '../../stylesheet/image.css'

const AmountPrice: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (fileList.length === 0) {
      message.error('กรุณาอัปโหลดสลิปก่อนยืนยันการชำระเงิน');
    } else {
      setIsModalVisible(false);
      setIsPaymentSuccess(true);
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
        <Upload className='upload-center' onChange={handleUploadChange} fileList={fileList}>
          <Button icon={<UploadOutlined />}>อัปโหลดสลิป</Button>
        </Upload>
        <div className="flex" style={{ display: 'flex', flexDirection: 'column', gap: 'small', width: '100%' }}>
          {/* <Button
            className="buttonAM"
            type="primary"
            block
            onClick={showModal}
          >
            <span style={{ fontSize: '20px' }}>ตรวจสอบการชำระเงิน</span>
          </Button> */}
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

// const AmountPrice: React.FC = () => (
//     {/* <Card className="custom-cardAM">
//       <text><b>ยอดเงินทั้งหมดในบัญชี</b></text>
//       <text className="color-price" style={{textAlign: 'right'}}>฿198,503.00</text><br/>
//       <text><b>ยอดเงินคงเหลือในบัญชี</b></text>
//       <text className="color-price" style={{textAlign: 'right'}}>฿126,505.00</text>
      
//       <Flex vertical gap="small" className="flex" style={{ width: '100%' }}>
//             <Button className="buttonAM" type="primary" block>
//                 <text style={{fontSize:'20'}}> ยืนยันการชำระเงิน</text>
//             </Button>
//       </Flex>
//     </Card> */}
// );

export default AmountPrice;