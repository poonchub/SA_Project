import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { Card } from 'antd';
import '../OrderTableList/OrderTableList.css';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ProductInterface } from '../../Interfaces/IProduct';
import { GetProductByID } from '../../services/http';
import { GetOrderItemByOrderID } from '../../services/http';

import { useParams } from 'react-router-dom';
import Header from '../../components/ProductMangement/Header';
import "./Orderdetail.css";
import { TableProps } from 'antd';;
import { apiUrl, GetImageByProductID, GetOrderItems } from '../../services/http';
import { ImageInterface } from '../../Interfaces/IImage';
// interface DataType {
//     key: React.Key;
//     pname: string;
//     piece: number;
//     pricePerPiece: string;
// }
  

// const columns: TableColumnsType<OrderItemInterface & { ProductName: string}> = [
//   {
//       title: 'ชื่อสินค้า',
//       dataIndex: 'ProductName',
//       width: 350,
//   },
//   {
//       title: 'จำนวน',
//       dataIndex: 'Quantity',
//       width: 150,
//   },
//   {
//       title: 'ราคาต่อหน่วย',
//       dataIndex: 'Price',
//       render: (price: number) => `฿${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Format price with comma and 2 decimal places
//   },
// ];
  
// // const data: DataType[] = [];
// // for (let i = 0; i < 100; i++) {
// //     data.push({
// //       key: i,
// //       pname: "NOTEBOOK (โน้ตบุ๊ค) ASUS TUF GAMING F15 FX507ZC4-HN072W (MECHA GRAY) (2Y)",
// //       piece: 1,
// //       pricePerPiece: "฿23,999",
// //     });
// // }

// const OrderTableList: React.FC<{ orderId: number }> = ({ orderId }) => {
//   const [orderItems, setOrderItems] = useState<OrderItemInterface[]>([]);
//   const [products, setProducts] = useState<{ [key: number]: ProductInterface }>({});
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//       const fetchData = async () => {
//           setLoading(true);
//           try {
//               // Fetch order items by orderId
//               const fetchedOrderItems = await GetOrderItemByOrderID(orderId); // Use ID 1 for the example
//               setOrderItems(fetchedOrderItems);

//               // Fetch product details for each product in the order items
//               const productData: { [key: number]: ProductInterface } = {};
//               await Promise.all(
//                   fetchedOrderItems.map(async (item: OrderItemInterface) => {
//                       if (item.ProductID) { // Check if ProductID is defined
//                           const product = await GetProductByID(item.ProductID);
//                           if (product) {
//                               productData[item.ProductID] = product;
//                           }
//                       }
//                   })
//               );
//               setProducts(productData);
//           } catch (error) {
//               console.error('Error fetching order items or products:', error);
//           } finally {
//               setLoading(false);
//           }
//       };

//       fetchData();
//   }, []);

//   // Combine order items with product names
//   const dataSource = orderItems.map((item: OrderItemInterface) => {
//     const productName = item.ProductID !== undefined ? products[item.ProductID]?.ProductName : 'Loading...';
//     return {
//         ...item,
//         ProductName: productName || 'Unknown', // Fallback to 'Unknown' if no product name
//     };
// });

//   return (
//       <div>
//           <Card className="custom-cardT">
//               <Table
//                   className="custom-table"
//                   columns={columns}
//                   dataSource={dataSource}
//                   pagination={false}
//                   loading={loading}
//                   rowKey="ID" // Ensure a unique key for each row, assuming ID is unique
//               />
//           </Card>
//       </div>
//   );
// };

// export default OrderTableList;




function OrderTableList() {
  const { orderId } = useParams<{ orderId: string }>();
  const [itemdetail, setItemdetail] = useState<(OrderItemInterface & { Product: ProductInterface, Images: ImageInterface[] })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function getOrdersItemdetail() {
    try {
      const res = await GetOrderItems();
      const filteredItems = res.filter((item: OrderItemInterface) => item.OrderID === Number(orderId));
      
      const itemsWithProducts = await Promise.all(
        filteredItems.map(async (item: OrderItemInterface) => {
          const product = await GetProductByID(Number(item.ProductID));
          const images = await GetImageByProductID(Number(item.ProductID)); // เรียกข้อมูลภาพ
          return { 
            ...item, 
            Product: product,
            Images: images // เก็บข้อมูลภาพแยกต่างหาก
          };
        })
      );

      setItemdetail(itemsWithProducts);
      console.log(itemsWithProducts);
    } catch (err) {
      setError('Failed to fetch order items.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOrdersItemdetail();
  }, []);

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') {
      return 'N/A';
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const columns: TableProps<OrderItemInterface & { Product: ProductInterface, Images: ImageInterface[] }>['columns'] = [
    {
      title: 'Order ID',
      dataIndex: 'OrderID',
      key: 'OrderID',
    },
    {
      title: 'Product Image',
      dataIndex: 'Images',
      key: 'ProductImage',
      render: (images: ImageInterface[]) => (
        images && images.length > 0 ? (
          <img src={apiUrl + '/' + images[0]?.FilePath} alt="Product" style={{ width: 100, height: 100 }} />
        ) : (
          <span>No Image</span>
        )
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'Product',
      key: 'ProductName',
      render: (product: ProductInterface) => {
        const productName = product?.ProductName || 'N/A';
        return productName.length > 60 ? `${productName.slice(0, 60)}...` : productName;
      },
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      key: 'Price',
      render: (text: number) => `฿${formatPrice(text)}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header page={"profile"} />
      <div className="show-detail-in-order">
        
        <div className="detail-table-orderid">
          <h3 id='orderdetail-all'>รายละเอียดคำสั้งซื้อ</h3>
          <Table<OrderItemInterface & { Product: ProductInterface, Images: ImageInterface[] }>
            columns={columns}
            dataSource={itemdetail}
            rowKey="ID"
          />
          <button id='but-back' onClick={() => window.history.back()}>ย้อนกลับ</button>
        </div>
      </div>
    </>
  );
}

export default OrderTableList;
