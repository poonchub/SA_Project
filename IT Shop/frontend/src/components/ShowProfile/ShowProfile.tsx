import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { UserOutlined,CalendarOutlined,MailOutlined,EnvironmentOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './ShowProfile.css'; 
import { CustomerInterface } from '../../Interfaces/ICustomer';
import { apiUrl, GetAddressByCustomerID, GetCustomerByID } from '../../services/http';
import { AddressInterface } from '../../Interfaces/IAddress';

const ShowProfile: React.FC = () => {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerInterface>()
  const [address, setAddress] = useState<AddressInterface[]>([])

  async function getCustomer(){
    let res = await GetCustomerByID(1)
    if (res) {
        setCustomer(res);
    }
    getAddress()
  }
  async function getAddress(){
    let res = await GetAddressByCustomerID(1)
    if (res) {
        setAddress(res);
    }
  }

  const addressElement = address.map((add,index) => {
    return (
      <tr key={index}>
            <td>
                <EnvironmentOutlined style={{ fontSize: '25px', color: '#FF2E63' }}/>
            </td>
            <td>{`${add.AddressDetail} ${add.Subdistrict} ${add.District} ${add.Province} ${add.ZipCode}`}</td>
      </tr>
      
    )
  })

  console.log(address)

  useEffect(()=>{
    getCustomer()
  }, [])

  console.log(customer)



  const handleClick = () => {
    navigate('/EditProfile');
  };

  return (
    <div className="container">
      <div className="image-container">
        <img
          src={`${apiUrl}/${localStorage.getItem("profilePath")}`}
          className="circular-image"
        />
        <img src="" alt="" />
      </div>
      <table>
        <tbody>
          <tr>
            <td>
                <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
            </td>
            <td valign='bottom'>{customer?.Prefix}{customer?.FirstName} {customer?.LastName}</td>
          </tr>
          <tr>
            <td>
                <CalendarOutlined style={{ fontSize: '25px', color: '#FF2E63' }}/>
            </td>
            <td>{customer?.Birthday?.slice(0,10)}</td>
          </tr>
          <tr>
            <td>
                <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }}/>
            </td>
            <td>{customer?.Email}</td>
          </tr>
          {addressElement}
        </tbody>
      </table>
      <Link to="/Edit">
        <p><Button
          className="button"
          type="primary"
          style={{ backgroundColor: '#FF2E63', borderColor: '#FF2E63' }}
          onClick={handleClick}
        >
          Edit profile
        </Button></p>
      </Link>
    </div>
  );
};

export default ShowProfile;
