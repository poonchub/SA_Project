import React from 'react';
import { Empty,Button } from 'antd';
import "../Empty/Empty.css";
import { Link } from 'react-router-dom';
function CustomEmpty() {
    return (
        <div className="empty-container">
           
            <Empty  imageStyle={{
                    height: 150,  // ปรับความสูงของไอคอน
                }}/>
      <Link to= "/Product">
            <Button type="primary" id="buy-button">เลือกซื้อสินค้า</Button>
            </Link>
            
        </div>
    );
}

export default CustomEmpty;
