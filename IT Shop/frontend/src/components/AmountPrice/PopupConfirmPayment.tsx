import React from 'react';
import './PopupConfirmPayment.css';

interface PopupConfirmPaymentProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PopupConfirmPayment: React.FC<PopupConfirmPaymentProps> = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div className="popup-container">
      <div className="popup-bg" />
      <div className="detail-box">
        <span className="title">ยืนยันการตรวจสอบการชำระเงิน</span>
        <p>คุณต้องการตรวจสอบการชำระเงินหรือไม่?</p>
        <div className="btn-box">
          <button className="cancel-btn" onClick={onCancel}>ยกเลิก</button>
          <button className="confirm-btn" onClick={onConfirm}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmPayment;