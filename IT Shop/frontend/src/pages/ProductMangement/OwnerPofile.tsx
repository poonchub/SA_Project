// import React, { useEffect, useState } from 'react';
// import { Button } from 'antd';
// import { UserOutlined, MailOutlined } from '@ant-design/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import './OwnerProfile.css';  // ใช้ไฟล์ CSS สำหรับจัดการ styling
// import { OwnerInterface } from '../interfaces/IOwner';
// import { apiUrl, GetOwnerById } from '../services/http';
// const OwnerProfile: React.FC = () => {
//   const navigate = useNavigate();
//   const [owner, setOwner] = useState<OwnerInterface>();

//   // ฟังก์ชันดึงข้อมูล Owner
//   async function getOwner() {
//     let res = await GetOwnerById(1); 
//     if (res) {
//         setOwner(res);
//     }
//   }

//   useEffect(() => {
//     getOwner();  
//   }, []);

//   const handleClick = () => {
//     navigate('/EditProfile'); 
//   };

//   return (
//     <div className="container">
//       <div className="image-container">
//         <img
//           src={`${apiUrl}/${localStorage.getItem("profilePath") || owner?.ProfilePath || '/images/default-profile.png'}`}
//           className="circular-image"
//           alt="Owner Profile"
//         />
//       </div>
//       <table>
//         <tbody>
//           <tr>
//             <td>
//                 <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
//             </td>
//             <td valign='bottom'>
//               {owner?.Prefix} {owner?.FirstName} {owner?.LastName}
//             </td>
//           </tr>
//           <tr>
//             <td>
//                 <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
//             </td>
//             <td>{owner?.Email}</td>
//           </tr>
//         </tbody>
//       </table>
//       <Link to="/Edit">
//         <p>
//           <Button
//             className="button"
//             type="primary"
//             style={{ backgroundColor: '#FF2E63', borderColor: '#FF2E63' }}
//             onClick={handleClick}
//           >
//             Edit Profile
//           </Button>
//         </p>
//       </Link>
//     </div>
//   );
// };

// export default OwnerProfile;
