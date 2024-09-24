import React from 'react';
import './PopupConfirmPayment.css';

interface PopupPaymentThx {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const PopupPaymentThx: React.FC<PopupPaymentThx> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="popup-container">
      <div className="popup-bg" />
      <div className="detail-box">
        <span className="title">ขอบคุณสำหรับการสั่งซื้อค่ะ</span>
        <p>อิอิ</p>
        <div className="btn-box">
        </div>
      </div>
    </div>
  );
};

export default PopupPaymentThx;