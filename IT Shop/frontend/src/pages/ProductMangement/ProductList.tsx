import { useContext, useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Spin } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import Layout, { Content } from 'antd/es/layout/layout';
import { AppContext } from '../../App';
import { apiUrl, DeleteProductByID, ListProducts } from '../../services/http';
import { ImageInterface } from '../../Interfaces/IImage';
import Header from '../../components/ProductMangement/Header';
import SearchBox from '../../components/ProductMangement/SearchBox';
import '../../components/ProductMangement/ProductListPage.css'
import { ProductInterface } from '../../Interfaces/IProduct';
import SelectBrand from '../../components/ProductMangement/SelectBrand';
import SelectCategory from '../../components/ProductMangement/SelectCategory';

function ProductList() {
    const { logoutPopup } = useContext(AppContext)

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [products, setProducts] = useState<ProductInterface[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>([]);
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
        setLoading(true); 
        setTimeout(() => {
            setLoading(false); 
            navigate(`/Product/Edit/${id}`); 
        }, 750); 
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
        applyFilters(selectedBrand, selectedCategory, searchTerm); 
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        applyFilters(selectedBrand, category, undefined); 
    };
    
    const handleBrandChange = (brand: string) => {
        setSelectedBrand(brand);
        applyFilters(brand, selectedCategory, undefined); 
    };
    
    const applyFilters = (
        brand: string | undefined,
        category: string | undefined,
        searchTerm: string | undefined,
        productList: ProductInterface[] = products
    ) => {
        let filtered = [...productList];
    
        if (brand) {
            filtered = filtered.filter(product => product.BrandID === Number(brand));
        }
    
        if (category) {
            filtered = filtered.filter(product => product.CategoryID === Number(category));
        }
    
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            const isNumeric = !isNaN(Number(searchTerm));
    
            filtered = filtered.filter(product => {
                if (isNumeric) {
                    return product.ID === Number(searchTerm);
                } else {
                    return product.ProductName?.toLowerCase().includes(lowerSearchTerm);
                }
            });
        }
    
        if (filtered.length === 0) {
            Modal.warning({
                title: 'ไม่พบสินค้า',
                content: `ไม่พบสินค้าที่ตรงกับค่าที่ค้นหา โปรดลองใหม่อีกครั้ง`,
                className: 'custom-modal',
                onOk: resetFilters, 
            });
        } else {
            setFilteredProducts(filtered);
        }
    };
    
    const resetFilters = () => {
        setSelectedBrand(undefined);
        setSelectedCategory(undefined);
        setFilteredProducts(products); 
    };

    const columns: ColumnsType<ProductInterface> = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            align: 'center',
        },
        {
            title: 'รูปภาพ',
            dataIndex: 'Images',
            key: 'Image',
            align: 'center',
            render: (images: ImageInterface[]) => {
                const imageFilePath = images && images.length > 0 ? images[0].FilePath : '';
                console.log(imageFilePath);
                return imageFilePath ? (
                    <img src={`${apiUrl}/${imageFilePath}`} alt="Product" style={{ maxWidth: '100px', height: 'auto' }} />
                ) : 'No Image';
            },
        },
        {
            title: 'ชื่อสินค้า',
            dataIndex: 'ProductName',
            key: 'ProductName',
            align: 'center',
        },
        {
            title: 'ราคา',
            dataIndex: 'PricePerPiece',
            key: 'Price',
            align: 'center',
            render: (price: number) => formatPrice(price),
        },
        {
            title: 'จำนวน',
            dataIndex: 'Stock',
            key: 'Stock',
            align: 'center',
        },
        {
            title: 'แบรนด์',
            dataIndex: 'Brand',
            key: 'Brand',
            align: 'center',
            render: (brand) => brand?.BrandName || 'N/A',
        },
        {
            title: 'หมวดหมู่',
            dataIndex: 'Category',
            key: 'Category',
            align: 'center',
            render: (category) => category?.CategoryName || 'N/A',
        },
        {
            title: 'จัดการ',
            key: 'action',
            align: 'center',
            render: (record: ProductInterface) => (
                <Space size="middle">
                    <Button onClick={() => handleEdit(record?.ID ?? 0)} type="primary"><img src='/images/icon/notepad.png' alt="notepad-box" className='notepad-box' />แก้ไข</Button>
                    <Button onClick={() => handleDelete(record?.ID ?? 0)} danger><img src='/images/icon/bin.png' alt="bin-box" className='bin-box' />ลบสินค้า</Button>
                </Space>
            )
        },
    ];

    return (
        <>
            {logoutPopup}
            <Header page={"ProductList"} />
            <Layout className="my-layout1">
                <div className="selected-but">
                    <SearchBox onSearch={handleSearch}  />
                    <SelectBrand onBrandChange={handleBrandChange} />
                    <SelectCategory onCategoryChange={handleCategoryChange} />
                </div>
                <Content style={{ padding: '0 20px', width:"90vw" }}>

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
                        ยกเลิก
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk} className="custom-ok-button">
                        ตกลง
                    </Button>,
                ]}
            >
                <p>{modalText}</p>
            </Modal>


        </>
    );
}

export default ProductList;
