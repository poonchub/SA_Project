import { useNavigate } from 'react-router-dom';
import './ButtonWithImage.css'; // สไตล์ของปุ่มที่มีรูปภาพ

interface ButtonWithImageProps {
  ownerId: number; // กำหนดประเภท ownerId
}

const ButtonWithImage: React.FC<ButtonWithImageProps> = ({ ownerId }) => {
  const navigate = useNavigate(); // สร้างฟังก์ชันนำทาง

  const handleEditClick = () => {
    console.log(`Navigating to /OwnerEditProfile/${ownerId}`);
    navigate(`/OwnerEditProfile/${ownerId}`); // นำทางไปยัง OwnerEditProfile
  };

  return (
    <div className="button-with-image-container">
      <button 
        className="btn-with-image" 
        onClick={handleEditClick} // ใช้ฟังก์ชันนำทางที่สร้างขึ้น
      >
        <img src="/images/icon/order-fulfillment.png" alt="Manage Bills Icon" className="btn-image" />
        จัดการโปรไฟล์
      </button>
      <button 
        className="btn-with-image" 
        onClick={() => navigate('/AdminManagement')} // ใช้ฟังก์ชันนำทางสำหรับ Admin Management
      >
        <img src="/images/icon/user.png" alt="Manage Admin Icon" className="btn-image" />
        จัดการแอดมิน
      </button>
    </div>
  );
};

export default ButtonWithImage;
