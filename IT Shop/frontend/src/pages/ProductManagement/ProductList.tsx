import { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Layout, { Content } from 'antd/es/layout/layout';
import { AppContext } from '../../App';
import { ProductInterFace } from '../../Interfaces/IProduct';
import { apiUrl, DeleteProductByID, ListProducts } from '../../services/http';
import { ImageInterface } from '../../Interfaces/IImage';
import Header from '../../components/ProductMangement/Header';
import SearchBox from '../../components/ProductMangement/SearchBox';
import '../../components/ProductMangement/ProductListPage.css'

function ProductList() {
    const { logoutPopup } = useContext(AppContext)

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductInterFace[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductInterFace[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState<string>("");
    const [deleteId, setDeleteId] = useState<number | undefined>();

    const getProducts = async () => {
        const resProduct = await ListProducts();
        if (resProduct) {
            setProducts(resProduct);
            setFilteredProducts(resProduct);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH').format(price) + '฿';
    };

    const handleEdit = (id: number) => {
        navigate(`/Product/Edit/${id}`);
    };

    const handleDelete = (id: number) => {
        const product = products.find(p => p.ID === id);
        setModalText(`คุณต้องการลบสินค้าชื่อ "${product?.ProductName}" หรือไม่ ?`);
        setDeleteId(id);
        setModalVisible(true);
    };

    const handleOk = async () => {
        if (deleteId === undefined) {
            message.error("Invalid product ID.");
            return;
        }

        setConfirmLoading(true);
        try {
            const res = await DeleteProductByID(deleteId);
            if (res) {
                setModalVisible(false);
                message.success("ลบข้อมูลสำเร็จ");
                getProducts();
            } else {
                message.error("เกิดข้อผิดพลาด !");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            message.error("Error deleting product.");
        }
        setConfirmLoading(false);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };


    const handleSearch = (searchTerm: string) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const isNumeric = !isNaN(Number(searchTerm));

        const filtered = products.filter(product => {
            if (isNumeric) {
                return product.ID === Number(searchTerm);
            } else {
                return product.ProductName?.toLowerCase().includes(lowerSearchTerm);
            }
        });

        applyFilters(filtered);
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        applyFilters();
    };

    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        applyFilters();
    };

    const applyFilters = (productList: ProductInterFace[] = products) => {
        let filtered = [...productList];

        if (selectedBrand) {
            filtered = filtered.filter(product => product.BrandID === Number(selectedBrand));
        }

        if (selectedCategory) {
            filtered = filtered.filter(product => product.CategoryID === Number(selectedCategory));
        }

        if (filtered.length === 0) {
            Modal.warning({
                title: 'ไม่พบสินค้า',
                content: `ไม่พบสินค้าที่ตรงกับค่าที่ค้นหา โปรดลองใหม่อีกครั้ง`,
                className: 'custom-modal',
                onOk: () => {
                    setLoading(true);
                    setTimeout(() => {
                        setFilteredProducts(products);
                        setLoading(false);
                    }, 1250);
                },
            });
        } else {
            setFilteredProducts(filtered);
        }
    };


    const columns: ColumnsType<ProductInterFace> = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            align: 'center',
        },
        {
            title: 'Image',
            dataIndex: 'Images',
            key: 'Image',
            align: 'center',
            render: (images: ImageInterface[]) => {
                const imageFilePath = images && images.length > 0 ? images[0].FilePath : '';
                return imageFilePath ? (
                    <img src={`${apiUrl}/${imageFilePath}`} alt="Product" style={{ maxWidth: '100px', height: 'auto' }} />
                ) : 'No Image';
            },
        },
        {
            title: 'Product Name',
            dataIndex: 'ProductName',
            key: 'ProductName',
            align: 'center',
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            key: 'Description',
            align: 'center',
            render: (description: string) => (
                description.length > 50 ? `${description.substring(0, 50)}...` : description
            ),
        },
        {
            title: 'Price',
            dataIndex: 'PricePerPiece',
            key: 'Price',
            align: 'center',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'Stock',
            dataIndex: 'Stock',
            key: 'Stock',
            align: 'center',
        },
        {
            title: 'Brand',
            dataIndex: 'Brand',
            key: 'Brand',
            align: 'center',
            render: (brand) => brand?.BrandName || 'N/A',
        },
        {
            title: 'Category',
            dataIndex: 'Category',
            key: 'Category',
            align: 'center',
            render: (category) => category?.CategoryName || 'N/A',
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (record: ProductInterFace) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record?.ID ?? 0)} type="primary">จัดการ</Button>
                    <Button onClick={() => handleDelete(record?.ID ?? 0)} danger>ลบสินค้า</Button>
                </Space>
            )
        },
    ];

    return (
        <>
            {logoutPopup}
            <Header page={"ProductList"} />
            <Layout className="my-layout1">
            <SearchBox
                        onSearch={handleSearch}
                        onCategoryChange={handleCategoryChange}
                        onBrandChange={handleBrandChange}
                    />
                <Content style={{ padding: '0 20px', marginTop: '20px' }}>
                    
                    {loading ? (
                        <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
                    ) : (
                        <Table
                            dataSource={filteredProducts}
                            columns={columns}
                            pagination={false}
                            bordered
                            rowKey="ID"
                            className="product-table"
                        />
                    )}
                </Content>
            </Layout>
            <Modal
                title="ยืนยันการลบสินค้า"
                open={modalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                className="custom-modal2"
                footer={[
                    <Button key="cancel" onClick={handleCancel} className="custom-cancel-button">
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk} className="custom-ok-button">
                        OK
                    </Button>,
                ]}
            >
                <p>{modalText}</p>
            </Modal>
            

        </>
    );
}

export default ProductList;
