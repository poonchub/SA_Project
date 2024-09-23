import { UserOutlined, MailOutlined } from '@ant-design/icons';
import './OwnerEditProfile.css';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, message } from 'antd';
import { OwnerInterface } from '../../../Interfaces/IOwner';
import { GendersInterface } from '../../../Interfaces/IGender';
import { apiUrl, GetGenders, GetOwnerByID, UpdateOwner } from '../../../services/http';
import OwnerHeader from '../../../components/ProductMangement/OwnerHeader';



function OwnerEditProfile() {
    const [owner, setOwner] = useState<OwnerInterface | null>(null);
    const [gender, setGender] = useState<GendersInterface[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [, setLoading] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<OwnerInterface | null>(null);

    let { id } = useParams();

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

            console.log(updatedOwner)
    
            const res = await UpdateOwner(Number(id), updatedOwner);

            if (res) {
                messageApi.open({
                    type: 'success',
                    content: 'อัปเดตโปรไฟล์สำเร็จ',
                });
                setTimeout(() => {
                    setLoading(false);
                    navigate('/OwnerProfile');
                }, 1000);
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
                        <img
                            src={profileImageUrl}
                            className="circular-image-edit"
                            alt="Owner Profile"
                        />
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
                    <Button type="primary" onClick={onFinish} className="save-button">
                        บันทึกการเปลี่ยนแปลง
                    </Button>

                </Card>
            </div>
        </>
    );
}

export default OwnerEditProfile;
