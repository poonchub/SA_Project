import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from 'antd';
import '../OrderTableList/OrderTableList.css';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ProductInterface } from '../../Interfaces/IProduct';
import { ImageInterface } from '../../Interfaces/IImage';
import { GetProductByID, GetOrderItemByOrderID, GetImageByProductID } from '../../services/http';
import { apiUrl } from '../../services/http';

const columns: TableColumnsType<OrderItemInterface & { ProductName: string, ProductImage: string }> = [
  {
      title: 'รูปภาพสินค้า',
      dataIndex: 'ProductImage',
      key: 'ProductImage',
      render: (image: string) => (
        image ? <img src={image} alt="Product" style={{ width: 100, height: 100 }} /> : <span>No Image</span>
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
      dataIndex: 'Price',
      key: 'Price',
      render: (price: number) => `฿${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Format price with comma and 2 decimal places
  },
];

const OrderTableList: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [products, setProducts] = useState<{ [key: number]: ProductInterface }>({});
  const [images, setImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);

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

  // Combine order items with product names and images
  const dataSource = orderItems.map((item: OrderItemInterface) => {
      const productName = item.ProductID !== undefined ? products[item.ProductID]?.ProductName : 'Loading...';
      const productImage = item.ProductID !== undefined ? images[item.ProductID] : '';
      return {
          ...item,
          ProductName: productName || 'Unknown', // Fallback to 'Unknown' if no product name
          ProductImage: productImage || '', // Fallback to empty string if no image
      };
  });

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
