import { UserOutlined, MailOutlined, StarOutlined } from '@ant-design/icons';
import './OwnerEditProfile.css';
import { GendersInterface } from '../../../../Interfaces/IGender';
import { useEffect, useMemo, useState } from 'react';
import { OwnerInterface } from '../../../../Interfaces/IOwner';
import Header from '../../../../components/ProductMangement/Header';
import { apiUrl, GetGenders, GetOwnerByID, UpdateOwner } from '../../../../services/http';
import { useParams } from 'react-router-dom';
import { Card, Button } from 'antd';

function OwnerEditProfile() {
    const [owner, setOwner] = useState<OwnerInterface | null>(null);
    const [gender, setGender] = useState<GendersInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (formData) {
            try {
                await UpdateOwner(owner?.ID || 0, formData);
                setError(null);
            } catch (err) {
                setError('Failed to update owner data.');
            }
        }
    };

    useEffect(() => {
        getOwner();
        getGender();
    }, []);

    const profileImageUrl = useMemo(() => {
        return `${apiUrl}/${localStorage.getItem("profilePath") || owner?.ProfilePath || '/images/default-profile.png'}`;
    }, [owner]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Header page={"profile"} />
            <div className="container-edit">
                <div className="image-container-edit">
                    <img
                        src={profileImageUrl}
                        className="circular-image-edit"
                        alt="Owner Profile"
                    />
                </div>
                <Card title="แก้ไขโปรไฟล์" className="edit-card">
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
                        <div className="form-group">
                            <StarOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
                            <input
                                type="text"
                                name="AdminRole"
                                className="input-field"
                                placeholder="Admin Role"
                                value={formData?.AdminRole || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <Button type="primary" onClick={handleUpdate} className="save-button">
                        บันทึกการเปลี่ยนแปลง
                    </Button>
                </Card>
            </div>
        </>
    );
}

export default OwnerEditProfile;
