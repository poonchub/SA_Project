import "./EditProfile.css";
import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Col,
  Row,
  Divider,
  Form,
  Input,
  Card,
  message,
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";
import { CustomerInterface } from "../../Interfaces/ICustomer";
import { GendersInterface } from "../../Interfaces/IGender";
import { GetAddressByCustomerID, GetCustomerByID, GetGenders, UpdateAddressByID, UpdateCustomerByID } from "../../services/http";
import { useNavigate } from "react-router-dom";
import { AddressInterface } from "../../Interfaces/IAddress";

  // เพิ่ม import สำหรับ UploadProfilePicture
import { UploadProfilePicture } from "../../services/http";

const { Option } = Select;

interface DataInterface {
  CustomerID?: number;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Password?: string;
  Birthday?: dayjs.Dayjs;
  GenderID?: number;
  AddressID?: number;
  Province?: string;
  District?: string;
  Subdistrict?: string;
  ZipCode?: string;
  AddressDetail?: string;
}

function Edit() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [customer, setCustomer] = useState<CustomerInterface>();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  const [addresses, setAddresses] = useState<AddressInterface[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInterface | null>(null);
  const [form] = Form.useForm();

  const id = localStorage.getItem("id") || "";



// เพิ่ม state และฟังก์ชัน
const [profileFile, setProfileFile] = useState<File | null>(null);
const [uploadMessage, setUploadMessage] = useState('');
const [uploadError, setUploadError] = useState('');

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files && event.target.files.length > 0) {
    setProfileFile(event.target.files[0]);
  }
};

const handleUploadProfilePicture = async () => {
  if (profileFile) {
    const formData = new FormData();
    formData.append('profile', profileFile);
    formData.append('customerID', id); // ส่ง customerID ด้วย

    try {
      const result = await UploadProfilePicture(formData);
      console.log(result);
      if (result) {
        setUploadMessage(result.message); // แสดงข้อความจาก API
        setUploadError('');

        // เก็บรูปโปรไฟล์ใหม่ใน localStorage
        localStorage.setItem('profilePath', result.newProfilePath);

        // บังคับให้รีเฟรชรูปโปรไฟล์ใน frontend
        window.location.reload();
      } else {
        setUploadError('เกิดข้อผิดพลาดในการอัพโหลดรูปโปรไฟล์');
        setUploadMessage('');
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    setUploadError('เกิดข้อผิดพลาด: ' + err.message);
  } else {
    setUploadError('เกิดข้อผิดพลาดที่ไม่รู้จัก');
  }
  setUploadMessage('');
}
  } else {
    setUploadError('กรุณาเลือกไฟล์รูปโปรไฟล์');
  }
};

  const onFinish = async (values: DataInterface) => {

    const birthDayFormatted = values.Birthday?.format('YYYY-MM-DDTHH:mm:ss[Z]') || "";

    let payloadCustomer: CustomerInterface = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Email: values.Email,
      GenderID: values.GenderID,
      Birthday: birthDayFormatted,
    };

    let payloadAddress: AddressInterface = {
      AddressDetail: values.AddressDetail,
      Subdistrict: values.Subdistrict,
      District: values.District,
      Province: values.Province,
      ZipCode: values.ZipCode,
    };

    try {
      let resCustomer = await UpdateCustomerByID(payloadCustomer, parseInt(id));
      let resAddress = await UpdateAddressByID(payloadAddress, selectedAddress?.ID);

      if (resCustomer && resAddress) {
        messageApi.open({
          type: "success",
          content: resAddress.message,
        });
      } else {
        messageApi.open({
          type: "error",
          content: resAddress.message || "Error updating data",
        });
      }
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: "error",
        content: "An error occurred",
      });
    }
  };

  const getGender = async () => {
    let res = await GetGenders();
    if (res) {
      setGenders(res);
    }
  };

  const getCustomerByID = async () => {
    let res = await GetCustomerByID(parseInt(id));
    if (res) {
      setCustomer(res);
      form.setFieldsValue({
        FirstName: res.FirstName,
        LastName: res.LastName,
        GenderID: res.GenderID,
        Email: res.Email,
        Birthday: dayjs(res.Birthday), 
      });
    }
  };

  const getAddressByCustomerID = async () => {
    let res = await GetAddressByCustomerID(parseInt(id));
    if (res && res.length > 0) {
      setAddresses(res);
      setSelectedAddress(res[0]);
      form.setFieldsValue({
        SelectAddress: res[0].ID,
        AddressDetail: res[0].AddressDetail,
        Subdistrict: res[0].Subdistrict,
        District: res[0].District,
        Province: res[0].Province,
        ZipCode: res[0].ZipCode,
      });
    }
  };

  const handleAddressChange = (value: number) => {
    const selected = addresses.find(address => address.ID === value);
    if (selected) {
      setSelectedAddress(selected);
      form.setFieldsValue({
        AddressDetail: selected.AddressDetail,
        Subdistrict: selected.Subdistrict,
        District: selected.District,
        Province: selected.Province,
        ZipCode: selected.ZipCode,
      });
    }
  };

  useEffect(() => {
    getGender();
    getCustomerByID();
    getAddressByCustomerID();
  }, []);

  return (
    <div className="edit-container">
      {contextHolder}
      <Card>
        <h2> แก้ไขข้อมูลส่วนตัว</h2>
        <Divider />
         {/* ส่วนที่เพิ่มเข้ามา */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col xs={24}>
          <Form.Item label="Upload Profile Picture">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <Button type="primary" onClick={handleUploadProfilePicture} style={{ marginLeft: "10px" }}>
              Upload
            </Button>
            {uploadMessage && <p style={{ color: 'green' }}>{uploadMessage}</p>}
            {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
          </Form.Item>
        </Col>
      </Row>

      <Form
        name="basic"
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >

      </Form>
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="FirstName"
                name="FirstName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="LastName"
                name="LastName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Email"
                name="Email"
                rules={[{ type: "email", required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Birthday"
                name="Birthday"
                rules={[
                  {
                    required: true
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" 
                  onFocus={(e) => e.target.style.borderColor = '#ED2939'}
                  onBlur={(e) => e.target.style.borderColor = '#ED2939'}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                
                label="Gender"
                name="GenderID"
                rules={[{ required: true }]}
              >
                <Select allowClear style={{borderColor: 'red'}}>
                  {genders.map((item) => (
                    <Option value={item.ID} key={item.Name}>
                      {item.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                name="SelectAddress"
                label="Select Address"
                rules={[{ required: true }]}
              >
                <Select allowClear onChange={handleAddressChange}>
                  {addresses.map((item) => (
                    <Option value={item.ID} key={item.ID}>
                      {item.AddressDetail}, {item.Subdistrict}, {item.District}, {item.Province}, {item.ZipCode}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="AddressDetail"
                name="AddressDetail"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="SubDistrict"
                name="Subdistrict"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="District"
                name="District"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="Province"
                name="Province"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ZipCode"
                name="ZipCode"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="start">
            <Col style={{ marginTop: "40px" }}>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-btn"
                    
                  >
                    Update
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default Edit;
