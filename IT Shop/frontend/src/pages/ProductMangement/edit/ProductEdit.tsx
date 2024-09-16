import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Layout, InputNumber, message } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import { CloseCircleOutlined } from '@ant-design/icons';
import { CategoryInterface } from '../../../Interfaces/ICategory';
import { BrandInterface } from '../../../Interfaces/IBrand';
import { ProductInterface } from '../../../Interfaces/IProduct';
import { GetBrands, GetCategories, GetProductByID, UpdateImage, UpdateProduct } from '../../../services/http';
import Header from '../../../components/ProductManagement/Header';
import '../../../components/ProductManagement/ProductFormPage.css';


const { Option } = Select;

interface ImageFile {
  id: number;
  file: File;
  preview: string;
}

function ProductEdit() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [brands, setBrands] = useState<BrandInterface[]>([]);
  const [product, setProduct] = useState<ProductInterface | null>(null);
  const [form] = Form.useForm();

  let { id } = useParams();


  // Fetch product data by ID
  const fetchProduct = async () => {
    const res = await GetProductByID(Number(id));
    if (res) {
      setProduct(res);
      form.setFieldsValue(res); 
    }
  };

  const getBrands = async () => {
    const res = await GetBrands();
    if (res) {
      setBrands(res);
    }
  };

  const getCategories = async () => {
    const res = await GetCategories();
    if (res) {
      setCategories(res);
    }
  };


  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const updatedProduct: ProductInterface = {
        ...product,
        ProductName: values.ProductName,
        Description: values.Description,
        PricePerPiece: values.PricePerPiece,
        Stock: values.Stock,
        BrandID: values.BrandID,
        CategoryID: values.CategoryID,
      };

      const res = await UpdateProduct(Number(id), updatedProduct);

      if (res) {
        if (images.length > 0) {
          const formData = new FormData();
          for (const image of images) {
            formData.append('image', image.file);
          }

          // Update the image
          const imageRes = await UpdateImage(formData, Number(id));
          if (!imageRes) {
            messageApi.open({
              type: 'error',
              content: 'Error occurred while updating images!',
            });
          } else {
            console.log('Image update response:', imageRes);
          }

        }

        messageApi.open({
          type: 'success',
          content: 'สินค้าอัปเดตสำเร็จ',
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Error occurred while updating product!',
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      messageApi.open({
        type: 'error',
        content: 'Server connection error!',
      });
    } finally {
      setLoading(false);
    }
  };



  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file, index) => ({
        id: Date.now() + index,
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (id: number) => {
    setImages(images.filter((img) => img.id !== id));
  };


  useEffect(() => {
    getBrands();
    getCategories();
    fetchProduct();
  }, [id]);

  return (
    <>
      {contextHolder}
      <Header page={undefined} />
      <div className="my-layout1">
        <Layout
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Content
            style={{
              padding: '20px',
              maxWidth: '800px',
              width: '100%',
            }}
          >
            <div
              className="form-container"
              style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Form.Item
                  name="ProductName"
                  label="Product Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Product Name!',
                    },
                  ]}
                  style={{ flex: '0 0 48%' }}
                >
                  <Input placeholder="Enter Product Name" />
                </Form.Item>

                <Form.Item
                  name="Description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Description!',
                    },
                  ]}
                  style={{ flex: '0 0 100%' }}
                >
                  <Input.TextArea placeholder="Enter Product Description" />
                </Form.Item>

                <Form.Item
                  name="PricePerPiece"
                  label="Price"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Price!',
                    },
                  ]}
                  style={{ flex: '0 0 48%' }}
                >
                  <InputNumber
                    placeholder="Enter Product Price"
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  name="Stock"
                  label="Quantity"
                  rules={[
                    {
                      required: true,
                      message: 'Please input the Quantity!',
                    },
                  ]}
                  style={{ flex: '0 0 48%' }}
                >
                  <InputNumber
                    placeholder="Enter Product Quantity"
                    style={{ width: '100%' }}
                    min={0}
                  />
                </Form.Item>

                <Form.Item
                  name="BrandID"
                  label="Brand"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the Brand!',
                    },
                  ]}
                  style={{ flex: '0 0 48%' }}
                >
                  <Select allowClear placeholder="Select Product Brand">
                    {brands.map((item) => (
                      <Option value={item.ID} key={item.BrandName}>
                        {item.BrandName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="CategoryID"
                  label="Category"
                  rules={[
                    {
                      required: true,
                      message: 'Please select the Category!',
                    },
                  ]}
                  style={{ flex: '0 0 48%' }}
                >
                  <Select allowClear placeholder="Select Category">
                    {categories.map((item) => (
                      <Option value={item.ID} key={item.CategoryName}>
                        {item.CategoryName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="Picture"
                  label="Images"
                  rules={[
                    {
                      required: true,
                      message: 'Please upload the product images!',
                    },
                  ]}
                  style={{ flex: '0 0 100%' }}
                >
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ marginBottom: '16px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {images.map((image) => (
                        <div key={image.id} style={{ position: 'relative' }}>
                          <img
                            src={image.preview}
                            alt="preview"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                          <CloseCircleOutlined
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              color: 'red',
                              fontSize: '20px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleRemoveImage(image.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </Form.Item>

                <Form.Item
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  <Link to="/">
                    <Button id="cancel-bt" type="default">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    id="submit-bt"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Content>
        </Layout>
      </div>
    </>
  );
}

export default ProductEdit;
