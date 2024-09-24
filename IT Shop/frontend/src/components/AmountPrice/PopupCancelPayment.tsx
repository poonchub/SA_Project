import React from 'react';
import './PopupConfirmPayment.css';

interface PopupCancelPaymentProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PopupConfirmPayment: React.FC<PopupCancelPaymentProps> = ({ visible, onConfirm, onCancel }) => {
  if (!visible) return null;

  return (
    <div className="popup-container">
      <div className="popup-bg" />
      <div className="detail-box">
        <span className="title">ยืนยันการยกเลิกคำสั่งซื้อ</span>
        <p>คุณต้องกายกเลิกคำสั่งซื้อนี้หรือไม่?</p>
        <div className="btn-box">
          <button className="cancel-btn" onClick={onCancel}>ยกเลิก</button>
          <button className="confirm-btn" onClick={onConfirm}>ยืนยัน</button>
        </div>
      </div>
    </div>
  );
};

export default PopupConfirmPayment;