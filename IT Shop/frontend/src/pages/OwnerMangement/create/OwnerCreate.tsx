import { useContext, useEffect, useState } from 'react';
import { Form, Input, Select, Layout, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { OwnerInterface } from '../../../Interfaces/IOwner';
import OwnerHeader from '../../../components/ProductMangement/OwnerHeader';
import { CreateOwner, GetGenders, UploadProfileOwner } from '../../../services/http';
import { GendersInterface } from '../../../Interfaces/IGender';
import CancelButton from '../../../components/ProductMangement/CancelButton';
import SubmitButton from '../../../components/ProductMangement/SubmitButton';
import './OwnerCreate.css';
import { AppContext } from '../../../App';
const { Option } = Select;

interface ImageFile {
    id: number;
    file: File;
    preview: string;
}


function OwnerCreate() {
    const { logoutPopup } = useContext(AppContext)

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
                Email: values.Email,
                Password: values.Password,
                GenderID: values.GenderID,
                ProfilePath: values.ProfilePath,
            };

            const createOwnerRes = await CreateOwner(dataOwner);

            if (createOwnerRes) {
                const ownerID = createOwnerRes.data.ID;
                // อัพโหลดภาพโปรไฟล์หากมีการเลือก
                const formData = new FormData();
                if (images.length > 0) {
                    formData.append("ownerID", ownerID.toString());
                    images.forEach(image => {
                        formData.append("owner-profile", image.file);
                    });

                    const uploadRes = await UploadProfileOwner(formData);
                    if (!uploadRes) {
                        throw new Error('Failed to upload profile image');
                    }
                }

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
            const newImages = Array.from(e.target.files).filter((file) => {
                const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
                const isValidSize = file.size <= 2 * 1024 * 1024;
                if (!isValidType) {
                    messageApi.error('Invalid file type! Only JPEG, PNG, and GIF are allowed.');
                    return false;
                }
                if (!isValidSize) {
                    messageApi.error('File size exceeds 2MB!');
                    return false;
                }
                return true;
            }).map((file, index) => ({
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
            URL.revokeObjectURL(imageToRemove.preview);
        }
        setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    };

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };


    return (
        <>
            {contextHolder}
            {logoutPopup}
            <OwnerHeader page={'Create-Owner'} />
            <div className="my-layout2">
                <Layout
                    style={{
                        minHeight: '100vh',
                        backgroundColor: '#F6F9FC',
                    }}
                >
                    <Content>
                        <div className="owner-form-container">
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
                                    label="ชื่อ"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อ!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="LastName"
                                    label="นามสกุล"
                                    rules={[{ required: true, message: 'กรุณากรอกนามสกุล!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="Email"
                                    label="อีเมล"
                                    rules={[
                                        {
                                            type: "email",
                                            message: "รูปแบบอีเมลไม่ถูกต้อง !",
                                        },
                                        {
                                            required: true,
                                            message: "กรุณากรอกอีเมล !",
                                        },
                                    ]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="Password"
                                    label="รหัสผ่าน"
                                    rules={[
                                        { required: true, message: 'กรุณากรอกรหัสผ่าน!' },
                                        { min: 6, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัว!' }
                                    ]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <div className="password-container">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="custom-password-input"
                                        />
                                        <img
                                            src={showPassword ? '/images/icon/eye.png' : '/images/icon/hidden.png'}
                                            alt="toggle password visibility"
                                            className={`toggle-password-visibility`}
                                            onClick={togglePasswordVisibility}
                                        />
                                    </div>
                                </Form.Item>
                                <Form.Item
                                    name="GenderID"
                                    label="เพศ"
                                    rules={[{ required: true, message: 'กรุณาเลือกเพศ!' }]}
                                    style={{ flex: '0 0 48%' }}
                                >
                                    <Select allowClear>
                                        {genders.map((item) => (
                                            <Option value={item.ID} key={item.Name}>
                                                {item.Name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="Picture"
                                    label="อัพโหลดรูปภาพ"
                                    rules={[{ required: true, message: 'กรุณาอัพโหลดรูปภาพโปรไฟล์!' }]}
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
                                    <CancelButton to="/OwnerProfile" />
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
