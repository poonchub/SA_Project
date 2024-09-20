import './ButtonWithImage.css'; // สไตล์ของปุ่มที่มีรูปภาพ

const ButtonWithImage = () => (
  <div className="button-with-image-container">
    <button 
      className="btn-with-image" 
      onClick={() => window.location.href = '/ProductManagement'}
    >
      <img src="/images/icon/order-fulfillment.png" alt="Manage Bills Icon" className="btn-image" />
      จัดการบิล
    </button>
    <button 
      className="btn-with-image" 
      onClick={() => window.location.href = '/AdminManagement'}
    >
      <img src="/images/icon/user.png" alt="Manage Admin Icon" className="btn-image" />
      จัดการแอดมิน
    </button>
  </div>
);

export default ButtonWithImage;
