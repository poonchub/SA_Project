// import { useState, useEffect } from "react";
// import {
//   Form,
//   Upload,
//   message,
// } from "antd";
// import dayjs from "dayjs";
// import { PlusOutlined } from "@ant-design/icons";
// import { CustomerInterface } from "../../Interfaces/ICustomer"; 
// import { AddressInterface } from "../../Interfaces/IAddress"; 
// import { GetAddresses } from "../../services/http";
// import { GetCustomers, GetCustomerByID, UpdateCustomer } from "../../services/http";
// import { useNavigate, useParams } from "react-router-dom";

// function CustomerEdit() {
//   const navigate = useNavigate();
//   const [messageApi] = message.useMessage();

//   const [customer, setCustomer] = useState<CustomerInterface>();
//   const [address, setAddresses] = useState<AddressInterface[]>([]);

//   // รับข้อมูลจาก params
//   let { id } = useParams();
//   // อ้างอิง form กรอกข้อมูล
//   const [form] = Form.useForm();

//   const normFile = (e: any) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e?.fileList;
//   };

//   const onFinish = async (values: CustomerInterface) => {
//     values.ID = customer?.ID;
//     let res = await UpdateCustomer(values);
//     if (res) {
//       messageApi.open({
//         type: "success",
//         content: res.message,
//       });
//       setTimeout(function () {
//         navigate("/customer");
//       }, 2000);
//     } else {
//       messageApi.open({
//         type: "error",
//         content: res.message,
//       });
//     }
//   };

//   const getCustomer = async () => {
//     let res = await GetCustomers();
//     if (res) {
//       setCustomer(res);
//     }
//   };

//   const getAddress = async () => {
//     let res = await GetAddresses();
//     if (res) {
//       setAddresses(res);
//     }
//   };

//   const getCustomerById = async () => {
//     let res = await GetCustomerByID(Number(id));
//     if (res) {
//       setCustomer(res);
//       // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
//       form.setFieldsValue({
//         Prefix: res.Prefix,
//         FirstName: res.FirstName,
//         LastName: res.LastName,
//         Email: res.Email,
//         Password: res.Password,
//         BirthDay: dayjs(res.BirthDay),
//       });
//     }
//   };

//   useEffect(() => {
//     getAddress();
//     getCustomerById();
//     getCustomer();
//   }, []);

//   return (
//     <>
//         <div className="edit-container">
//             <h2>แก้ไขข้อมูลส่วนตัว</h2>
//             <div className="upload">
//     <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
//       <Upload action="/upload.do" listType="picture-card">
//         <button style={{ border: 0, background: 'none' }} type="button">
//           <PlusOutlined />
//           <div style={{ marginTop: 8 }}>Upload</div>
//         </button>
//       </Upload>
//     </Form.Item>
//     <Form
//           name="basic"
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           autoComplete="off"
//         ></Form>
//   </div>

//             <form className='grid-container'>
//                 <div className="prefix-box">
//                     <span>Prefix</span>
//                     <select name="" id="" required>
//                         <option value=""></option>
//                         <option value="">นาย</option>
//                         <option value="">นาง</option>
//                         <option value="">นางสาว</option>
//                     </select>
//                 </div>
//                 <div className="fname-box">
//                     <span>First Name</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="lname-box">
//                     <span>Last Name</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="birthday-box">
//                     <span>Birthday</span>
//                     <input type="date" name='' required/>
//                 </div>
//                 <div className="email-box">
//                     <span>Email</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="password-box">
//                     <span>Password</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="address-box">
//                     <span>Address</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="province-box">
//                     <span>Province</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="district-box">
//                     <span>District</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="subdistrict-box">
//                     <span>Subdistrict</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="zipcode-box">
//                     <span>Zip-Code</span>
//                     <input type="text" name='' required/>
//                 </div>
//                 <div className="submit-box">
//                     <input className='btn' type="submit" value="Update"/>
//                 </div>
//             </form>
            

//         </div>
//     </>
// )
// }
// export default CustomerEdit;

import { useState, useEffect } from "react";
import { Form, Upload, message, Input, Button, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import { CustomerInterface } from "../../Interfaces/ICustomer"; 
import { AddressInterface } from "../../Interfaces/IAddress"; 
import { GetAddresses, GetCustomerByID, UpdateCustomer } from "../../services/http";
import { useNavigate, useParams } from "react-router-dom";

function CustomerEdit() {
  const navigate = useNavigate();
  const [messageApi] = message.useMessage();

  const [customer, setCustomer] = useState<CustomerInterface>();
  const [addresses, setAddresses] = useState<AddressInterface[]>([]);

  // รับข้อมูลจาก params
  let { id } = useParams();
  // อ้างอิง form กรอกข้อมูล
  const [form] = Form.useForm();

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values: CustomerInterface) => {
    values.ID = customer?.ID;
    let res = await UpdateCustomer(values);
    if (res) {
      messageApi.open({
        type: "success",
        content: res.message,
      });
      setTimeout(function () {
        navigate("/customer");
      }, 2000);
    } else {
      messageApi.open({
        type: "error",
        content: res.message,
      });
    }
  };

  const getCustomerById = async () => {
    let res = await GetCustomerByID(Number(id));
    if (res) {
      setCustomer(res);
      // set form ข้อมูลเริ่มของผู่้ใช้ที่เราแก้ไข
      form.setFieldsValue({
        Prefix: res.Prefix,
        FirstName: res.FirstName,
        LastName: res.LastName,
        Email: res.Email,
        Password: res.Password,
        BirthDay: dayjs(res.BirthDay),
        Address: res.Address,
        Province: res.Province,
        District: res.District,
        Subdistrict: res.Subdistrict,
        ZipCode: res.ZipCode,
      });
    }
  };

  useEffect(() => {
    getCustomerById();
  }, []);

  return (
    <>
      <div className="edit-container">
        <h2>แก้ไขข้อมูลส่วนตัว</h2>
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Prefix" name="Prefix">
            <Select>
              <Select.Option value="นาย">นาย</Select.Option>
              <Select.Option value="นาง">นาง</Select.Option>
              <Select.Option value="นางสาว">นางสาว</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="First Name"
            name="FirstName"
            rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="LastName"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Birthday"
            name="BirthDay"
            rules={[{ required: true, message: "กรุณาเลือกวันเกิด" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            rules={[{ required: true, type: "email", message: "กรุณากรอกอีเมล" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="Password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Address"
            name="Address"
            rules={[{ required: true, message: "กรุณากรอกที่อยู่" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Province"
            name="Province"
            rules={[{ required: true, message: "กรุณากรอกจังหวัด" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="District"
            name="District"
            rules={[{ required: true, message: "กรุณากรอกอำเภอ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subdistrict"
            name="Subdistrict"
            rules={[{ required: true, message: "กรุณากรอกตำบล" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zip-Code"
            name="ZipCode"
            rules={[{ required: true, message: "กรุณากรอกรหัสไปรษณีย์" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload action="/upload.do" listType="picture-card">
              <button
                style={{ border: 0, background: "none" }}
                type="button"
              >
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

export default CustomerEdit;
