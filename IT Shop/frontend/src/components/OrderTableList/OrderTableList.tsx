import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from 'antd';
import '../OrderTableList/OrderTableList.css';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ProductInterface } from '../../Interfaces/IProduct';
import { GetProductByID, GetOrderItemByOrderID, GetImageByProductID } from '../../services/http';
import { apiUrl } from '../../services/http';

const columns: TableColumnsType<OrderItemInterface & { ProductName: string, ProductImage: string }> = [
  {
      title: 'รูปภาพสินค้า',
      dataIndex: 'ProductImage',
      key: 'ProductImage',
      render: (image: string) => (
        image ? (
            <img src={image} alt="Product" style={{ width: 100, height: 100 }} />
          ) : (
            <div style={{
              width: '100px',
              height: '100px',
              border: '2px dashed #FF2E63',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px',
              color: '#FF2E63'
              
            }}>
              <h3>3% off</h3>
            </div>
          )
      ),
      width: 150,
  },
  {
      title: 'ชื่อสินค้า',
      dataIndex: 'ProductName',
      key: 'ProductName',
      width: 350,
  },
  {
      title: 'จำนวน',
      dataIndex: 'Quantity',
      key: 'Quantity',
      width: 150,
  },
  {
      title: 'ราคาต่อหน่วย',
      dataIndex: 'UnitPrice',
      key: 'UnitPrice',
      render: (price: number) => {
        if (price !== undefined && price !== null) {
            const formattedPrice = price < 0 
                ? `-฿${Math.abs(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                : `฿${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            return formattedPrice; // แสดงราคาต่อหน่วยที่แท้จริง
        }
        return 'N/A'; // แสดงข้อความที่เหมาะสมเมื่อไม่มีราคา
      }
    },
];

const OrderTableList: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [products, setProducts] = useState<{ [key: number]: ProductInterface }>({});
  const [images, setImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const [totalPriceFromOrder, setTotalPriceFromOrder] = useState<number>(0); // State สำหรับ TotalPrice ของ Order

  


  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              // Fetch order items by orderId
              const fetchedOrderItems = await GetOrderItemByOrderID(orderId);
              setOrderItems(fetchedOrderItems);

              // Fetch product details and images for each product in the order items
              const productData: { [key: number]: ProductInterface } = {};
              const imageData: { [key: number]: string } = {};

              await Promise.all(
                  fetchedOrderItems.map(async (item: OrderItemInterface) => {
                      if (item.ProductID) { // Check if ProductID is defined
                          const product = await GetProductByID(item.ProductID);
                          if (product) {
                              productData[item.ProductID] = product;
                              // Fetch product image
                              const images = await GetImageByProductID(item.ProductID);
                              if (images && images.length > 0) {
                                  imageData[item.ProductID] = apiUrl + '/' + images[0].FilePath; // Save the image URL
                              }
                          }
                      }
                  })
              );
              setProducts(productData);
              setImages(imageData);
          } catch (error) {
              console.error('Error fetching order items, products, or images:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, [orderId]);

    // คำนวณยอดรวมของ OrderItems
    const totalItemPrice = orderItems.reduce((sum, item) => sum + ((item.Price || 0)), 0);
    
    console.log("Total item price:", totalItemPrice);


  // Combine order items with product names and images
  const dataSource = orderItems.map((item: OrderItemInterface) => {
      const productName = item.ProductID !== undefined ? products[item.ProductID]?.ProductName : 'Loading...';
      const productImage = item.ProductID !== undefined ? images[item.ProductID] : '';
      const unitPrice = item.ProductID !== undefined ? products[item.ProductID]?.PricePerPiece : 0;  // ใช้ราคาจาก product
      console.log("Price per peace: ", unitPrice)
      return {
          ...item,
          ProductName: productName || 'Unknown', // Fallback to 'Unknown' if no product name
          ProductImage: productImage || '', // Fallback to empty string if no image
          UnitPrice: unitPrice, // เพิ่มราคาต่อหน่วย
      };
  });

  // ถ้ายอดรวมของ OrderItems มากกว่า TotalPrice ของ Order ให้เพิ่มแถวส่วนลด
  if (totalItemPrice > totalPriceFromOrder) {
    const discountAmount = Math.round(totalItemPrice * 0.03);
    console.log("Discount: ", discountAmount);
    dataSource.push({
        ID: 'discount', // ค่า ID แบบไม่ซ้ำ
        ProductName: 'ส่วนลด 3%',
        ProductImage: '',
        Quantity: 1,
        UnitPrice: -discountAmount.toFixed(2), // แสดงส่วนลด
    } as any); // แปลงชนิดของ object ให้ตรงกับ dataSource
  }

  return (
      <div>
          <Card className="custom-cardT">
              <Table
                  className="custom-table"
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  loading={loading}
                  rowKey="ID" // Ensure a unique key for each row, assuming ID is unique
              />
          </Card>
      </div>
  );
};

export default OrderTableList;