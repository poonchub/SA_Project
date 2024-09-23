import { useMemo, useState } from "react";
import { OwnerInterface } from "../../../Interfaces/IOwner";
import { apiUrl, GetGenders, GetOwners } from "../../../services/http";
import Table, { ColumnsType } from "antd/es/table";
import { Modal, Button, Layout } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import './AdminManagement.css'; // CSS for the Admin Management page
import { Content } from "antd/es/layout/layout";
import OwnerHeader from "../../../components/ProductMangement/OwnerHeader";
import { GendersInterface } from "../../../Interfaces/IGender";

function AdminManagement() {
    const [owners, setOwners] = useState<OwnerInterface[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState<OwnerInterface | null>(null);
    const [genders, setGenders] = useState<GendersInterface[]>([]);

    const getOwner = async () => {
        const res = await GetOwners();
        if (res) {
            setOwners(res);
        }
    }

    const getGender = async () => {
        let res = await GetGenders();
        if (res) {
            setGenders(res);
        }
    }

    const getGenderName = (genderID: number) => {
        const gender = genders.find(g => g.ID === genderID);
        return gender ? gender.Name : 'N/A';
    };
    

    useState(() => {
        getOwner();
        getGender();
    });

    const showModal = (owner: OwnerInterface) => {
        setSelectedOwner(owner); // Set the selected owner to display in the modal
        setIsModalVisible(true); // Show the modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Hide the modal
    };

    const handleEdit = (owner: OwnerInterface) => {
        console.log("Edit owner:", owner);
        setIsModalVisible(false);
    };

    const handleDelete = (owner: OwnerInterface) => {
        // Logic to delete the owner
        console.log("Delete owner:", owner.ID);
        setIsModalVisible(false);
    };

    const getProfileImageUrl = (owner: OwnerInterface | null) => {
        // ตรวจสอบว่า ProfilePath มีค่า ถ้าไม่มีให้ใช้ภาพดีฟอลต์
        return `${apiUrl}/${owner?.ProfilePath || '/images/default-profile.png'}`;
    };
    
    const profileImageUrl = useMemo(() => {
        return getProfileImageUrl(selectedOwner);
    }, [selectedOwner]);
    
    const columns: ColumnsType<OwnerInterface> = [
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            align: 'center',

        },

        {
            title: 'ชื่อ',
            dataIndex: 'FirstName',
            key: 'FirstName',
            align: 'center',

        },
        {
            title: 'นามสกุล',
            dataIndex: 'LastName',
            key: 'LastName',
            align: 'center',

        },

        {
            title: 'เพศ',
            dataIndex: 'GenderID',
            key: 'GenderID',
            align: 'center',
            render: (genderID: number) => getGenderName(genderID),
        },

        {
            title: 'อีเมล',
            dataIndex: 'Email',
            key: 'Email',
            align: 'center',

        },
        {
            title: 'จัดการ',
            key: 'actions',
            align: 'center',
            render: (_text, record) => (
                <span onClick={() => showModal(record)} style={{ cursor: 'pointer' }}>
                    <MoreOutlined />
                </span>
            )
        }

    ];

    return (
        <>
            <OwnerHeader page={"admin-management"}/>
            <Layout className="my-layout1">
                <Content style={{ padding: '0 20px', marginTop: '20px' }}>
                    <div className="admin-management-container">
                        <Table
                            dataSource={owners}
                            columns={columns}
                            pagination={false}
                            scroll={{ x: 768 }}
                            bordered
                            rowKey="ID"
                            className="owner-table"

                        />

                        <Modal
                            title="Admin Details"
                            visible={isModalVisible}
                            onCancel={handleCancel}
                            footer={null}
                        >
                            {selectedOwner && (
                                <div className="modal-content">
                                    <img
                                        src={profileImageUrl}
                                        className="custom-image"
                                        alt="Owner Profile"
                                    />
                                    <div className="modal-details">
                                        <p><strong>ID:</strong> {selectedOwner.ID}</p>
                                        <p><strong>First Name:</strong> {selectedOwner.FirstName}</p>
                                        <p><strong>Last Name:</strong> {selectedOwner.LastName}</p>
                                        <p><strong>Email:</strong> {selectedOwner.Email}</p>

                                    </div>
                                    <div className="modal-actions">
                                        <Button
                                            type="primary"
                                            onClick={() => handleEdit(selectedOwner)}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            type="default"
                                            onClick={() => handleDelete(selectedOwner)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Modal>
                    </div>


                </Content>
            </Layout>

        </>

    );
}

export default AdminManagement;
