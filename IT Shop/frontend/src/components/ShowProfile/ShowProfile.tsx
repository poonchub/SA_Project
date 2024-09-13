import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UserOutlined, CalendarOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ShowProfile.css';
import { CustomerInterface } from '../../Interfaces/ICustomer';
import { apiUrl, GetAddressByCustomerID, GetCustomerByID } from '../../services/http';
import { AddressInterface } from '../../Interfaces/IAddress';
import { Col, Row, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { OrderInterface } from '../../Interfaces/IOrder';
import { GetOrders } from '../../services/http';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const ShowProfile: React.FC = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerInterface | undefined>(undefined);
  const [address, setAddress] = useState<AddressInterface[]>([]);
  const [order, setOrders] = useState<OrderInterface[]>([]);

  const columns: ColumnsType<DataType> = [
    {
      title: "ชื่อสินค้า",
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "จำนวน",
      dataIndex: "Quantity",
      key: "Quantity",
    },
    {
      title: "ราคาต่อหน่วย",
      dataIndex: "PricePerPiece",
      key: "PricePerPiece",
    },
  ];
  
  const data: DataType[] = [];

  async function getCustomer() {
    try {
      let res = await GetCustomerByID(1);
      if (res) {
        setCustomer(res);
      }
      getAddress();
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  }

  async function getAddress() {
    try {
      let res = await GetAddressByCustomerID(1);
      if (res) {
        setAddress(res);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }

  async function getOrders() {
    try {
      const res = await GetOrders();
      if (res) {
        setOrders(res);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  const addressElement = address.length > 0 ? address.map((add, index) => (
    <tr key={index}>
      <td>
        <EnvironmentOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
      </td>
      <td>{`${add.AddressDetail} ${add.Subdistrict} ${add.District} ${add.Province} ${add.ZipCode}`}</td>
    </tr>
  )) : (
    <tr>
      <td colSpan={2}>No address found</td>
    </tr>
  );

  useEffect(() => {
    getCustomer();
    getOrders();
  }, []);

  const handleClick = () => {
    navigate('/EditProfile');
  };

  return (
    <div className="container">
      <div className="image-container">
        <img
          // @ts-ignore
          src={customer?.ProfilePath ? `${apiUrl}/${customer.ProfilePath}` : ''}
          alt="Profile"
          className="circular-image"
        />
      </div>
      <table>
        <tbody>
          <tr>
            <td>
              <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
            </td>
            <td valign='bottom'>
              {customer ? `${customer.FirstName} ${customer.LastName}` : 'Loading...'}
            </td>
          </tr>
          <tr>
            <td>
              <CalendarOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
            </td>
            <td>{customer?.Birthday ? customer.Birthday.slice(0, 10) : 'Loading...'}</td>
          </tr>
          <tr>
            <td>
              <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
            </td>
            <td>{customer?.Email || 'Loading...'}</td>
          </tr>
          {addressElement}
        </tbody>
      </table>
      <Link to="/EditProfile">
        <Button
          className="button"
          type="primary"
          style={{ backgroundColor: '#FF2E63', borderColor: '#FF2E63' }}
          onClick={handleClick}
        >
          Edit profile
        </Button>
      </Link>
      <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <center><h3>Order List</h3></center>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>
    </div>
  );
};

export default ShowProfile;

// import React, { useEffect, useState } from 'react';
// import { Button, message, Modal } from 'antd';
// import { UserOutlined, CalendarOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
// import { Link, useNavigate } from 'react-router-dom';
// import './ShowProfile.css';
// import { CustomerInterface } from '../../Interfaces/ICustomer';
// import { apiUrl, GetAddressByCustomerID, GetCustomerByID, GetOrderByCustomerID } from '../../services/http';
// import { AddressInterface } from '../../Interfaces/IAddress';
// import { OrderInterface } from '../../Interfaces/IOrder';
// import Table, { ColumnsType } from 'antd/es/table';

// const ShowProfile: React.FC = () => {
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState<CustomerInterface | undefined>(undefined);
//   const [address, setAddress] = useState<AddressInterface[]>([]);
//   const [orders, setOrders] = useState<OrderInterface[]>([]);

//   const columns: ColumnsType<OrderInterface> = [
//     {
//       title: "ชื่อสินค้า",
//       dataIndex: "ProductName",
//       key: "productname",
//     },
//     {
//       title: "จำนวน",
//       dataIndex: "Quantity",
//       key: "quantity",
//     },
//     {
//       title: "ราคาต่อหน่วย",
//       dataIndex: "PricePerPiece",
//       key: "priceperpiece",
//     },
//   ];

//   const getOrders = async () => {
//     let res = await GetOrderByCustomerID(1);
//     if (res) {
//       setOrders(res);
//     }
//   };

//   async function getCustomer() {
//     try {
//       let res = await GetCustomerByID(1);
//       if (res) {
//         setCustomer(res);
//       }
//       getAddress();
//     } catch (error) {
//       console.error('Error fetching customer:', error);
//     }
//   }

//   async function getAddress() {
//     try {
//       let res = await GetAddressByCustomerID(1);
//       if (res) {
//         setAddress(res);
//       }
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//     }
//   }

//   const addressElement = address.length > 0 ? address.map((add, index) => (
//     <tr key={index}>
//       <td>
//         <EnvironmentOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
//       </td>
//       <td>{`${add.AddressDetail} ${add.Subdistrict} ${add.District} ${add.Province} ${add.ZipCode}`}</td>
//     </tr>
//   )) : (
//     <tr>
//       <td colSpan={2}>No address found</td>
//     </tr>
//   );

//   useEffect(() => {
//     getOrders();
//     getCustomer();
//   }, []);

//   const handleClick = () => {
//     navigate('/EditProfile');
//   };

//   return (
//     <div className="container">
//       <div className="image-container">
//         <img
//           // @ts-ignore
//           src={customer?.ProfilePath ? `${apiUrl}/${customer.ProfilePath}` : ''}
//           alt="Profile"
//           className="circular-image"
//         />
//       </div>
//       <table>
//         <tbody>
//           <tr>
//             <td>
//               <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
//             </td>
//             <td valign='bottom'>
//               {customer ? `${customer.FirstName} ${customer.LastName}` : 'Loading...'}
//             </td>
//           </tr>
//           <tr>
//             <td>
//               <CalendarOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
//             </td>
//             <td>{customer?.Birthday ? customer.Birthday.slice(0, 10) : 'Loading...'}</td>
//           </tr>
//           <tr>
//             <td>
//               <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
//             </td>
//             <td>{customer?.Email || 'Loading...'}</td>
//           </tr>
//           {addressElement}
//         </tbody>
//       </table>
//       <Link to="/EditProfile">
//         <Button
//           className="button"
//           type="primary"
//           style={{ backgroundColor: '#FF2E63', borderColor: '#FF2E63' }}
//           onClick={handleClick}
//         >
//           Edit profile
//         </Button>
//       </Link>
//       {/* <Divider /> */}
//       <div style={{ marginTop: 20 }}>
//         <Table rowKey="ID" columns={columns} dataSource={orders} />
//       </div>
//     </div>
//   );
// };

// export default ShowProfile;