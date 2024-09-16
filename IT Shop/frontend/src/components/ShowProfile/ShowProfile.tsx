import React, { useEffect, useState } from 'react';
import { Button, Space, Table } from 'antd';
import { UserOutlined, CalendarOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ShowProfile.css';
import { CustomerInterface } from '../../Interfaces/ICustomer';
import { apiUrl, GetAddressByCustomerID, GetCustomerByID, GetOrderByCustomerID } from '../../services/http';
import { AddressInterface } from '../../Interfaces/IAddress';
import { OrderInterface } from '../../Interfaces/IOrder';
import { Col, Row } from "antd";

const ShowProfile: React.FC = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerInterface | undefined>(undefined);
  const [address, setAddress] = useState<AddressInterface[]>([]);
  const [orders, setOrders] = useState<OrderInterface[]>([]);

  const id = localStorage.getItem("id") || "";

  async function getCustomer() {
    try {
      let res = await GetCustomerByID(parseInt(id));
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
      let res = await GetAddressByCustomerID(parseInt(id));
      if (res) {
        setAddress(res);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  }

  async function getOrderByCustomerID() {
    try {
      const res = await GetOrderByCustomerID(parseInt(id));
      if (res) {
        setOrders(res);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid Date');
      }
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const orderColumns = [
    { 
      title: 'Order Date', 
      dataIndex: 'CreatedAt', 
      key: 'CreatedAt',
      render: (text: string) => formatDate(text)
    },
    { title: 'Total Price', dataIndex: 'TotalPrice', key: 'TotalPrice' },
    { title: 'Status', dataIndex: 'Status', key: 'Status' },
    {
      title: '',
      key: 'action',
      align: 'center',
      render: (record: OrderInterface) => (
        <Link to="/Payment">
          <Space size="middle">
              <Button style={{backgroundColor: "var(--subtheme-color1)"}} type="primary" onClick={()=>localStorage.setItem("orderId", `${record.ID}`)}>ชำระเงิน</Button>
          </Space>
        </Link>   
      )
  },
  ];

  useEffect(() => {
    getCustomer();
    // getOrders();
    getOrderByCustomerID();
  }, []);

  const handleClick = () => {
    navigate('/EditProfile');
  };

  return (
    <div className="profile-container">
      <div className="image-container">
        <img
          src={`${apiUrl}/${localStorage.getItem("profilePath")}`}
          className="circular-image"
        />
      </div>
      <div className="profile-detail">
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
              <td>{customer?.Email}</td>
            </tr>
            {address.length > 0 ? address.map((add, index) => (
              <tr key={index}>
                <td>
                  <EnvironmentOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
                </td>
                <td>{`${add.AddressDetail} ${add.Subdistrict} ${add.District} ${add.Province} ${add.ZipCode}`}</td>
              </tr>
            )) : (
              <tr>
                <td>
                  <EnvironmentOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
                </td>
                <td colSpan={2}>No address found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="button-container">
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
        </div>
        <Row gutter={[16, 16]}>
          <h3>Order List</h3>
          <Col xs={24}>
            <Table
              // @ts-ignore
              columns={orderColumns}
              dataSource={orders.map(order => ({
                ...order,
                key: order.ID
              }))}
              pagination={false}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ShowProfile;
