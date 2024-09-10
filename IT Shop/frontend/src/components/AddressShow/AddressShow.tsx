import React, { useEffect, useState } from 'react';
import { Card, Result } from 'antd';
import { GetAddressByOrderID } from '../../services/http';
import { AddressInterface } from '../../Interfaces/IAddress';
import '../AddressShow/AddressShow.css';
import edit from '../../assets/edit.svg';
import location from '../../assets/location.svg';
import { Button, Flex } from 'antd';

const AddressShow: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [address, setAddress] = useState<AddressInterface | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    async function fetchAddress() {
      try {
        // Fetch Address by orderId
        const addressRes = await GetAddressByOrderID(orderId);
        console.log('Address Data:', addressRes); // ตรวจสอบข้อมูลที่ได้รับ
        if (addressRes) {
          setAddress(addressRes);
        } else {
          setError('ไม่พบข้อมูลที่อยู่');
        }
      } catch (err) {
        setError('ไม่สามารถดึงข้อมูลได้');
        console.error(err);
      }
    }

    fetchAddress();
  }, [orderId]);

  return (
    <div className="card-containerA">
      <Card
        title={
          <div className="card-title">
            <img src={location} alt="Location Icon" className="location-icon" />
            <span>ที่อยู่ในการจัดส่ง</span>
          </div>
        }
        className="custom-cardA"
      >
        {error ? (
          <Result
            status="error"
            title="เกิดข้อผิดพลาด"
            subTitle={error}
          />
        ) : (
          <Card className="custom-card-background">
            {address ? (
              <div>
                <p>{address.AddressDetail}</p>
                <p>{address.Subdistrict}, {address.District}, {address.Province}, {address.ZipCode}</p>
              </div>
            ) : (
              <p>ไม่พบข้อมูลที่อยู่</p>
            )}
          </Card>
        )}
        <Flex vertical gap="small" className="flex" style={{ width: '100%' }}>
          {/* <Button className="buttonAddr" type="primary" block>
            <img src={edit} alt="Edit Icon" />
          </Button> */}
          <div className="btn">
          <img src={edit} alt="Edit Icon" />
            </div>
        </Flex>
      </Card>
    </div>
  );
};

export default AddressShow;
