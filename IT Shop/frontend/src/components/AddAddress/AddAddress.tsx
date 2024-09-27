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

  console.log(localStorage.getItem("before-add-address"))
  console.log(localStorage.getItem("before-add-address")=="/selected")

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
        setTimeout(() => {
          const path = localStorage.getItem("before-add-address")=="/selected"
          if (path){
            localStorage.setItem("before-add-address","")
            navigate("/Selected");
          }
          else {
            navigate("/Profile");
          }
        }, 2000);
      } else {
        messageApi.open({
          type: "error",
          content: "เกิดข้อผิดพลาด",
        });
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "เกิดข้อผิดพลาด",
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
      <Card style={{width: "100%", display:"flex", justifyContent: "center"}}>
        <h2> เพิ่มที่อยู่ </h2>
        <Divider />
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{width: "100%", display: "flex", flexDirection: "column"}}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="ที่อยู่"
                name="AddressDetail"
                rules={[{ required: true, message: "กรุณากรอกที่อยู่ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="แขวง/ตำบล"
                name="Subdistrict"
                rules={[{ required: true, message: "กรุณากรอกแขวง/ตำบล !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="อำเภอ/เขต"
                name="District"
                rules={[{ required: true, message: "กรุณากรอกเขต/อำเภอ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="จังหวัด"
                name="Province"
                rules={[{ required: true, message: "กรุณากรอกจังหวัด !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={12}>
              <Form.Item
                label="รหัสไปรษณีย์"
                name="ZipCode"
                rules={[{ required: true, message: "กรุณากรอกรหัสไปรษณีย์ !" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{width: '100%'}}>
            <Col style={{ marginTop: "40px", width: '100%', display: 'flex' }}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" className="submit-btn">
                    บันทึก
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
