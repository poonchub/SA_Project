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
import { apiUrl, GetAddressByCustomerID, GetCustomerByID, GetGenders, UpdateAddressByID, UpdateCustomerByID, UploadProfilePicture } from "../../services/http";
import { useNavigate } from "react-router-dom";
import { AddressInterface } from "../../Interfaces/IAddress";

const { Option } = Select;

interface DataInterface {
  CustomerID?: number;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Password?: string;
  Birthday?: dayjs.Dayjs;
  PhoneNumber?: string;
  GenderID?: number;
  AddressID?: number;
  Province?: string;
  District?: string;
  Subdistrict?: string;
  ZipCode?: string;
  AddressDetail?: string;
}

function Edit() {
  const [messageApi, contextHolder] = message.useMessage();
  const [customer, setCustomer] = useState<CustomerInterface>();
  const [genders, setGenders] = useState<GendersInterface[]>([]);
  const [addresses, setAddresses] = useState<AddressInterface[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressInterface | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [form] = Form.useForm();

  const id = localStorage.getItem("id") || "";

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const ProfilePath = customer ? (customer.ProfilePath!="" ? `${apiUrl}/${customer.ProfilePath}` : "./images/icon/user-black.png") : ""

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfileFile(event.target.files[0]);
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
      }
    }
  };

  const handleUploadProfilePicture = async () => {
    if (profileFile) {
      const formData = new FormData();
      formData.append('profile', profileFile);
      formData.append('customerID', id);

      try {
        const result = await UploadProfilePicture(formData);
        localStorage.setItem("profilePath", result.data.ProfilePath);
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

  const onFinish = async (values: DataInterface) => {
    const birthDayFormatted = values.Birthday?.format('YYYY-MM-DDTHH:mm:ss[Z]') || "";

    let payloadCustomer: CustomerInterface = {
      FirstName: values.FirstName,
      LastName: values.LastName,
      Email: values.Email,
      GenderID: values.GenderID,
      Birthday: birthDayFormatted,
      PhoneNumber: values.PhoneNumber
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
        localStorage.setItem("firstName", resCustomer.FirstName);
        localStorage.setItem("lastName", resCustomer.LastName);
        messageApi.open({
          type: "success",
          content: resAddress.message,
        });

        // Upload profile picture after updating customer and address
        await handleUploadProfilePicture();
        
      } else {
        messageApi.open({
          type: "error",
          content: resAddress.message || "Error updating data",
        });
      }

      setTimeout(() => {
        location.href = "/Profile";
      }, 1000);
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
        PhoneNumber: res.PhoneNumber 
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
      <Card style={{overflowX: "hidden", display:"flex", flexDirection: "column", justifyItems:"center", alignItems:"center"}}>
        <h2> แก้ไขข้อมูลส่วนตัว</h2>
        <Divider />
         {/* ส่วนที่เพิ่มเข้ามา */}
      <Row gutter={[16, 16]} >
        <Col xs={24} style={{display: "flex", flexDirection: "column", justifyItems:"center", alignItems:"center"}}>
          <div className="show-profile-box">
            <img src={
                imagePreview=="" ? ProfilePath : imagePreview
              } 
              alt="Selected" 
            />
          </div>
          <Form.Item style={{ display:"flex", justifyContent:"center"}}>
            <div id="btn-upload-image">
              <label htmlFor="fileInput">เลือกรูปภาพ</label>
            </div>
            <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
          </Form.Item>
        </Col>
      </Row>
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{display:"flex", flexDirection: "column", alignItems: "flex-start"}}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ชื่อ"
                name="FirstName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="นามสกุล"
                name="LastName"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อีเมล"
                name="Email"
                rules={[{ type: "email", required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="วันเกิด"
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
                
                label="เพศ"
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
                label="เลือกที่อยู่"
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
                label="ที่อยู่"
                name="AddressDetail"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="แขวง/ตำบล"
                name="Subdistrict"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เขต/อำเภอ"
                name="District"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="จังหวัด"
                name="Province"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="รหัสไปรษณีย์"
                name="ZipCode"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="เบอร์โทรศัพท์"
                name="PhoneNumber"
                rules={[{ required: true }]}
              >
                <Input maxLength={13} minLength={13} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="123-456-7890"/>
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
                    onClick={handleUploadProfilePicture}
                    
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