import { useEffect , useState } from 'react';
import { Form, Input, Select, Layout, InputNumber, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { CategoryInterface } from '../../../Interfaces/ICategory';
import { BrandInterface } from '../../../Interfaces/IBrand';
import { ProductInterface } from '../../../Interfaces/IProduct';
import { CreateImage, CreateProduct, GetBrands, GetCategories } from '../../../services/http';
import Header from '../../../components/ProductMangement/Header';
import CancelButton from '../../../components/ProductMangement/CancelButton';
import SubmitButton from '../../../components/ProductMangement/SubmitButton';
import '../../../components/ProductMangement/ProductFormPage.css'


const { Option } = Select;

interface ImageFile {
  id: number;
  file: File;
  preview: string;
}


function ProductCreate() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [brands, setBrands] = useState<BrandInterface[]>([]);
  const [form] = Form.useForm();




  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      const dataProduct: ProductInterface = {
        ProductName: values.ProductName,
        Description: values.Description,
        PricePerPiece: values.PricePerPiece,
        Stock: values.Stock,
        BrandID: values.BrandID,
        CategoryID: values.CategoryID,
      };

      const res = await CreateProduct(dataProduct);

      const formData = new FormData();
      for (const image of images) {
        formData.append('image', image.file);
      }

      CreateImage(formData, res.data.ID)

      if (res) {
        messageApi.open({
          type: 'success',
          content: 'บันทึกข้อมูลสินค้าสำเร็จ',
        });
        form.resetFields();
        setImages([]);
      } else {
        messageApi.open({
          type: 'error',
          content: 'เกิดข้อผิดพลาด!',
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      messageApi.open({
        type: 'error',
        content: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์',
      });
    } finally {
      setLoading(false);
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
  }, []);


  return (
    <>
      {contextHolder}
      <Header page={'Create Product'} />
      <div className="my-layout1">
        <Layout
          style={{
            minHeight: '100vh',
          }}
        >
          <Content
          >
            <div
              className="form-container"
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
                  id='price-input'
                >
                  <InputNumber
                    placeholder="Enter Product Price"
                    style={{ width: '100%' }}
                    min={0}
                    step={0.01} 
                    precision={2} 
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
                  className="custom-select-brand"
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
                  className="custom-select-category"
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
                        <div key={image.id} className="image-preview-container">
                          <img
                            src={image.preview}
                            alt="preview"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                          <CloseCircleOutlined
                            className="close-icon"
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
                  <CancelButton to="/ProductManagement" />
                 <SubmitButton loading={loading} />
                </Form.Item>
              </Form>
            </div>
          </Content>
        </Layout>
      </div>
    </>
  );
}

export default ProductCreate;
