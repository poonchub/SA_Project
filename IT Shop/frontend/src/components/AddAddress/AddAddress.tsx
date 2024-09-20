// import { useState, useEffect } from "react";
// import {
//   Space,
//   Button,
//   Col,
//   Row,
//   Divider,
//   Form,
//   Input,
//   Card,
//   message,
// } from "antd";
// import { CustomerInterface } from "../../Interfaces/ICustomer";
// import { AddressInterface } from "../../Interfaces/IAddress";
// import { AddAddress } from "../../services/http";
// import { useNavigate } from "react-router-dom";
// import { GetCustomerByID } from "../../services/http";

// const id = localStorage.getItem("id") || "";

// function Add() {
//   const navigate = useNavigate();
//   const [messageApi, contextHolder] = message.useMessage();
//   const [customers, setCustomers] = useState<CustomerInterface[]>([]);
//   const [form] = Form.useForm();

//   const onFinish = async (values: AddressInterface) => {
//     let res = await AddAddress(values);
//     console.log(res)
//     if (res) {
//       messageApi.open({
//         type: "success",
//         content: "บันทึกข้อมูลสำเร็จ",
//       });
//       setTimeout(function () {
//         navigate("/address");
//       }, 2000);
//     } else {
//       messageApi.open({
//         type: "error",
//         content: "เกิดข้อผิดพลาด !",
//       });
//     }
//   };

//   const getCustomer = async () => {
//     let res = await GetCustomerByID(parseInt(id));
//     if (res) {
//       setCustomers(res);
//     }
//   };

//   useEffect(() => {
//     getCustomer();
//   }, []);

//   return (
//     <div className="edit-container">
//       {contextHolder}
//       <Card>
//         <h2> เพิ่มที่อยู่ </h2>
//         <Divider />
//         <Form
//           name="basic"
//           form={form}
//           layout="vertical"
//           onFinish={onFinish}
//           autoComplete="off"
//         >
//           <Row gutter={[16, 16]}>
//             <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//               <Form.Item
//                 label="AddressDetail"
//                 name="AddressDetail"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//               <Form.Item
//                 label="SubDistrict"
//                 name="Subdistrict"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//               <Form.Item
//                 label="District"
//                 name="District"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//               <Form.Item
//                 label="Province"
//                 name="Province"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//             <Col xs={24} sm={24} md={24} lg={24} xl={12}>
//               <Form.Item
//                 label="ZipCode"
//                 name="ZipCode"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row justify="start">
//             <Col style={{ marginTop: "40px" }}>
//               <Form.Item>
//                 <Space>
//                   <Button
//                     type="primary"
//                     htmlType="submit"
//                     className="submit-btn"
                    
//                   >
//                     Save
//                   </Button>
//                 </Space>
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Card>
//     </div>
//   );

// }

// export default Add;
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
} from "antd";
import { CustomerInterface } from "../../Interfaces/ICustomer";
import { AddressInterface } from "../../Interfaces/IAddress";
import { AddAddress } from "../../services/http";
import { useNavigate } from "react-router-dom";
import { GetCustomerByID } from "../../services/http";
import "./AddAddress.css"

const Add = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [customers, setCustomers] = useState<CustomerInterface[]>([]);
  const [form] = Form.useForm();
  const id = localStorage.getItem("id") || "";

  const onFinish = async (values: AddressInterface) => {
    const payload = {
      ...values,
      CustomerID: parseInt(id), // ใช้ ID จาก localStorage
    };

    try {
      let res = await AddAddress(payload);
      console.log(res);
      if (res) {
        messageApi.open({
          type: "success",
          content: "บันทึกข้อมูลสำเร็จ",
        });
        // setTimeout(() => {
        //   navigate("/profile");
        // }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด !",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาดในการบันทึกข้อมูล!",
      });
      console.error(error);
    }
  };

  const getCustomer = async () => {
    let res = await GetCustomerByID(parseInt(id));
    if (res) {
      setCustomers(res);
    }
  };

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <div className="add-container">
      {contextHolder}
      <Card>
        <h2> เพิ่มที่อยู่ </h2>
        <Divider />
        <Form
          style={{
            flexDirection: "column",
            alignItems: "flex-start"
          }}
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
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
                label="Subdistrict"
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
                  <Button type="primary" htmlType="submit" className="submit-btn">
                    Save
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Add;
