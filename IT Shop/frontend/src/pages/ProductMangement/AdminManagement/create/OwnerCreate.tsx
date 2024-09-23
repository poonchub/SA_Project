import { useEffect, useState } from 'react';
import { Form, Input, Select, Layout, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { OwnerInterface } from '../../../../Interfaces/IOwner';
import OwnerHeader from '../../../../components/ProductMangement/OwnerHeader';
import { CreateOwnerWithImage, GetGenders } from '../../../../services/http';
import { GendersInterface } from '../../../../Interfaces/IGender';
import CancelButton from '../../../../components/ProductMangement/CancelButton';
import SubmitButton from '../../../../components/ProductMangement/SubmitButton';
import './OwnerCreate.css';
const { Option } = Select;

interface ImageFile {
    id: number;
    file: File;
    preview: string;
}


function OwnerCreate() {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [genders, setGenders] = useState<GendersInterface[]>([]);
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            
            const dataOwner: OwnerInterface = {
                FirstName: values.FirstName,
                LastName: values.LastName,
                AdminRole: values.AdminRole,
                Email: values.Email,
                Password: values.Password,
                GenderID: values.GenderID,
            };
    
            const imageFile = images.length > 0 ? images[0].file : null;
            CreateOwnerWithImage(dataOwner, imageFile);
            
            if (dataOwner&&imageFile) {
                messageApi.open({
                type: 'success',
                content: 'บันทึกข้อมูลสำเร็จ',
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
            messageApi.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        } finally {
            setLoading(false);
        }
    };
    
    
    

    const getGenders = async () => {
        const res = await GetGenders();
        if (res) {
            setGenders(res);
        }
    };

    useEffect(() => {
        getGenders();
    }, []);

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
        const imageToRemove = images.find((img) => img.id === id);
        if (imageToRemove) {
            // Free the memory used by the image URL
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    };

    return (
        <>
            {contextHolder}
            <OwnerHeader page={'Create Owner'} />
            <div className="my-layout1">
                <Layout
                    style={{
                        minHeight: '100vh',
                    }}
                >
                    <Content>
                        <div className="form-container">
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
                                    name="FirstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please input the First Name!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input placeholder="Enter First Name" />
                                </Form.Item>

                                <Form.Item
                                    name="LastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please input the Last Name!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input placeholder="Enter Last Name" />
                                </Form.Item>

                                <Form.Item
                                    name="AdminRole"
                                    label="AdminRole"
                                    rules={[{ required: true, message: 'Please input the AdminRole!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input placeholder="Enter Owner or Admin" />
                                </Form.Item>

                                <Form.Item
                                    name="Email"
                                    label="Email"
                                    rules={[
                                        { required: true, message: 'Please input your Email!' },
                                        { type: 'email', message: 'The input is not a valid email!' },
                                        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email must contain @!' },
                                    ]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input placeholder="Enter Email" />
                                </Form.Item>

                                <Form.Item
                                    name="Password"
                                    label="Password"
                                    rules={[{ required: true, message: 'Please input your Password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
                                    style={{ flex: '0 0 48%' }}
                                    className='custom-password-input'
                                >
                                    <Input.Password placeholder="Enter Password" />
                                </Form.Item>

                                <Form.Item
                                    name="GenderID"
                                    label="Gender"
                                    rules={[{ required: true, message: 'Please select the Gender!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Select allowClear placeholder="เลือกเพศ">
                                        {genders.map((item) => (
                                            <Option value={item.ID} key={item.Name}>
                                                {item.Name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="Picture"
                                    label="Images"
                                    style={{ flex: '0 0 100%' }}
                                >
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
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

                                <Form.Item style={{ width: '100%', textAlign: 'center' }}>
                                    <CancelButton to="/AdminManagement" />
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

export default OwnerCreate;
