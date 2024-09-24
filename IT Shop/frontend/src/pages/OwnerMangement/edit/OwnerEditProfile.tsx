import { UserOutlined, MailOutlined } from '@ant-design/icons';
import './OwnerEditProfile.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { OwnerInterface } from '../../../Interfaces/IOwner';
import { GendersInterface } from '../../../Interfaces/IGender';
import { apiUrl, GetGenders, GetOwnerByID, UpdateOwner, UploadProfileOwner } from '../../../services/http';
import OwnerHeader from '../../../components/ProductMangement/OwnerHeader';

function OwnerEditProfile() {
    const [owner, setOwner] = useState<OwnerInterface | null>(null);
    const [gender, setGender] = useState<GendersInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [, setLoading] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<OwnerInterface | null>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [, setUploadMessage] = useState('');
    const [, setUploadError] = useState('');
    const [imagePreview, setImagePreview] = useState("");

    // let { id } = useParams();
    const id = localStorage.getItem("owner_id") || "";


    async function getOwner() {
        try {
            const res = await GetOwnerByID(Number(id));
            setOwner(res);
            setFormData(res);
        } catch (err) {
            setError('Failed to fetch owner data.');
        } finally {
            setLoading(false);
        }
    }

    const getGender = async () => {
        let res = await GetGenders();
        if (res) {
            setGender(res);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileFile(e.target.files[0]);
            const file = e.target.files[0];
            if (file) {
                const imageUrl = URL.createObjectURL(file);
                setImagePreview(imageUrl);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: type === 'checkbox' ? e.target.checked : value,
            };
            return updatedData;
        });
    };

    const handleUploadProfilePicture = async () => {
        if (profileFile) {
            const formData = new FormData();
            formData.append('owner-profile', profileFile);
            formData.append('ownerID', id);

            try {
                const result = await UploadProfileOwner(formData);
                console.log(result.data.ProfilePath);
                localStorage.setItem('OwnerprofilePath', result.data.ProfilePath);
                if (result) {
                    setUploadMessage(result.message);
                    setUploadError('');
                } else {
                    throw new Error('\nเกิดข้อผิดพลาดในการอัพโหลดรูปโปรไฟล์นะจ๊ะ');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : '\nไม่รู้จักข้อผิดพลาดนี้จ่ะ';
                setUploadError(`Error: ${errorMessage}`);
                setUploadMessage('');
            }
        } else {
            setUploadError('กรุณาเลือกไฟล์รูปโปรไฟล์');
        }
    };

    const onFinish = async () => {
        try {
            setLoading(true);

            const updatedOwner: OwnerInterface = {
                FirstName: formData?.FirstName,
                LastName: formData?.LastName,
                Email: formData?.Email,
                ProfilePath: formData?.ProfilePath,
                GenderID: Number(formData?.GenderID)
            };

            const res = await UpdateOwner(Number(id), updatedOwner);
            console.log(res);
            if (res) {
                localStorage.setItem('firstName', res.data.FirstName);
                localStorage.setItem('lastName', res.data.LastName);
                messageApi.open({
                    type: 'success',
                    content: 'อัปเดตโปรไฟล์สำเร็จ',
                });
                await handleUploadProfilePicture();
                // setTimeout(() => {
                //     setLoading(false);
                //     navigate('/OwnerProfile/');
                // }, 1000);
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Error occurred while updating profile!',
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

    useEffect(() => {
        getOwner();
        getGender();
    }, []);

    const profileImageUrl = useMemo(() => {
        return `${apiUrl}/${localStorage.getItem("profilePath") || owner?.ProfilePath || '/images/default-profile.png'}`;
    }, [owner]);

    return (
        <>
            {contextHolder}
            <OwnerHeader page={"profile"} />
            <div className="container-edit">
                <Card title="แก้ไขโปรไฟล์" className="edit-card">
                    <div className="image-container-edit">
                        {/* <img
                            src={profileImageUrl}
                            className="circular-image-edit"
                            alt="Owner Profile"
                        /> */}
                        <div className="show-profile-box">
                            <img src={
                                imagePreview == "" ? `${apiUrl}/${owner ? owner.ProfilePath : ""}` : imagePreview
                            }
                                alt="Selected"
                            />
                        </div>
                        <div id="btn-upload-image">
                            <label htmlFor="fileInput">เลือกรูปภาพ</label>
                        </div>
                        <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                    </div>
                    <div className="form-fields">
                        <div className="form-group">
                            <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
                            <input
                                type="text"
                                name="FirstName"
                                className="input-field"
                                placeholder="ชื่อ"
                                value={formData?.FirstName || ''}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="LastName"
                                className="input-field"
                                placeholder="นามสกุล"
                                value={formData?.LastName || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <img src='/images/icon/gender.png' className='gender-image' alt="Gender" />
                            <select
                                name="GenderID"
                                className="select-field"
                                value={formData?.GenderID || ''}
                                onChange={handleChange}
                            >
                                {gender.map(g => (
                                    <option key={g.ID} value={g.ID}>{g.Name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
                            <input
                                type="email"
                                name="Email"
                                className="input-field"
                                placeholder="อีเมล"
                                value={formData?.Email || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="btn-edit-pofile">
                        <Button type="link" onClick={() => navigate('/OwnerProfile')} className="back-button">
                            <img src="/images/icon/back.png" alt="Cancel" className='back-image' />
                            ย้อนกลับ
                        </Button>
                        <Button type="primary" onClick={onFinish} className="save-button">
                            บันทึกการเปลี่ยนแปลง
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}

export default OwnerEditProfile;
