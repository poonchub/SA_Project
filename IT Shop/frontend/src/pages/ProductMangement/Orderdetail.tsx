import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ProductMangement/Header';
import "./Orderdetail.css";
import { Table, TableProps } from 'antd';;
import { apiUrl, GetImageByProductID, GetOrderItems, GetProductByID } from '../../services/http';
import { ProductInterface } from '../../Interfaces/IProduct';
import { OrderItemInterface } from '../../Interfaces/IOrderItem';
import { ImageInterface } from '../../Interfaces/IImage';

function Orderdetail() {
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
          
        </div>
      </div>
    </>
  );
}

export default Orderdetail;
