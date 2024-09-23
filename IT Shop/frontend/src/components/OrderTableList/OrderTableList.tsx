import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from 'antd';
import '../OrderTableList/OrderTableList.css';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ProductInterface } from '../../Interfaces/IProduct';
import { GetProductByID } from '../../services/http';
import { GetOrderItemByOrderID } from '../../services/http';
// interface DataType {
//     key: React.Key;
//     pname: string;
//     piece: number;
//     pricePerPiece: string;
// }
  

const columns: TableColumnsType<OrderItemInterface & { ProductName: string}> = [
  {
      title: 'ชื่อสินค้า',
      dataIndex: 'ProductName',
      width: 350,
  },
  {
      title: 'จำนวน',
      dataIndex: 'Quantity',
      width: 150,
  },
  {
      title: 'ราคาต่อหน่วย',
      dataIndex: 'Price',
      render: (price: number) => `฿${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Format price with comma and 2 decimal places
  },
];
  
// const data: DataType[] = [];
// for (let i = 0; i < 100; i++) {
//     data.push({
//       key: i,
//       pname: "NOTEBOOK (โน้ตบุ๊ค) ASUS TUF GAMING F15 FX507ZC4-HN072W (MECHA GRAY) (2Y)",
//       piece: 1,
//       pricePerPiece: "฿23,999",
//     });
// }

const OrderTableList: React.FC<{ orderId: number }> = ({ orderId }) => {
  const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
  const [products, setProducts] = useState<{ [key: number]: ProductInterface }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              // Fetch order items by orderId
              const fetchedOrderItems = await GetOrderItemByOrderID(orderId); // Use ID 1 for the example
              setOrderItems(fetchedOrderItems);

              // Fetch product details for each product in the order items
              const productData: { [key: number]: ProductInterface } = {};
              await Promise.all(
                  fetchedOrderItems.map(async (item: OrderItemInterface) => {
                      if (item.ProductID) { // Check if ProductID is defined
                          const product = await GetProductByID(item.ProductID);
                          if (product) {
                              productData[item.ProductID] = product;
                          }
                      }
                  })
              );
              setProducts(productData);
          } catch (error) {
              console.error('Error fetching order items or products:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchData();
  }, []);

  // Combine order items with product names
  const dataSource = orderItems.map((item: OrderItemInterface) => {
    const productName = item.ProductID !== undefined ? products[item.ProductID]?.ProductName : 'Loading...';
    return {
        ...item,
        ProductName: productName || 'Unknown', // Fallback to 'Unknown' if no product name
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