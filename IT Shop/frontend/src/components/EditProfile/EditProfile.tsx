import "./EditProfile.css"
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Upload,
  } from 'antd';
import { useEffect, useState } from "react";
import { CustomerInterface } from "../../Interfaces/ICustomer";
import { AddressInterface } from "../../Interfaces/IAddress";
import { GetAddressByCustomerID, GetCustomerByID } from "../../services/http";

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

function Edit(){

  //const [prefixs, setPrefixs] = useState<PrefixsInterface[]>([]);

    const [customer, setCustomer] = useState<CustomerInterface>()
    const [address, setAddress] = useState<AddressInterface[]>([])
    const [selAdd, setSltAdd] = useState(0)

    const addDetail = address.length>0 ? address[selAdd].AddressDetail : ""
    const addSubDistrict = address.length>0 ? address[selAdd].Subdistrict : ""
    const addDistrict = address.length>0 ? address[selAdd].District : ""
    const addProvince = address.length>0 ? address[selAdd].Province : ""
    const addZipCode = address.length>0 ? address[selAdd].ZipCode : ""
  
    async function getCustomer(){
      let res = await GetCustomerByID(1)
      if (res) {
          setCustomer(res);
      }
      getAddress()
    }
    async function getAddress(){
      let res = await GetAddressByCustomerID(1)
      if (res) {
          setAddress(res);
      }
    }

    function setAddID(e:any){
        setSltAdd((e.target.value)-1)
    }

    // @ts-ignore
    const [year, month, day] = customer!=null ? (customer.Birthday?.slice(0,10)).split('-') : ""
    const dateFormat = `${year}-${month}-${day}`
  
    const addressElement = address.map((add,index) => {
      return (
        <option value={add.ID} key={index}>{add.AddressDetail} {add.Subdistrict} {add.District} {add.Province} {add.ZipCode}</option> 
      )
    })

    console.log(dateFormat)

    // const getPrefix = async () => {
    //   let res = await GetPrefixs();
    //   if (res) {
    //     setPrefixs(res);
    //   }
    // };
  
    useEffect(() => {
      getCustomer();
    }, []);

    return (
        <>
            <div className="edit-container">
                <h2>แก้ไขข้อมูลส่วนตัว</h2>
                <div className="upload">
        <Form.Item valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
      </div>

                <form className='grid-container'>
                    <div className="prefix-box">
                        <span>Prefix</span>
                        <select name="" id="" required>
                            <option value=""></option>
                            <option value="">นาย</option>
                            <option value="">นาง</option>
                            <option value="">นางสาว</option>
                        </select>
                    </div>
                    <div className="fname-box">
                        <span>First Name</span>
                        <input type="text" name='' defaultValue={customer?.FirstName} required/>
                    </div>
                    <div className="lname-box">
                        <span>Last Name</span>
                        <input type="text" name='' defaultValue={customer?.LastName} required/>
                    </div>
                    <div className="birthday-box">
                        <span>Birthday</span>
                        <input type="date" name='' defaultValue={dateFormat} required/>
                    </div>
                    <div className="email-box">
                        <span>Email</span>
                        <input type="text" name='' defaultValue={customer?.Email} required/>
                    </div>
                    <div className="password-box">
                        <span>Password</span>
                        <input type="text" name='' defaultValue={customer?.Password} required/>
                    </div>
                    <select className="select-address" name="address" onChange={setAddID}>
                        {addressElement}
                    </select>

                    <div className="address-box">
                        <span>Address</span>
                        <input type="text" defaultValue={addDetail} name='' required/>
                    </div>
                    <div className="province-box">
                        <span>Province</span>
                        <input type="text" defaultValue={addProvince} name='' required/>
                    </div>
                    <div className="district-box">
                        <span>District</span>
                        <input type="text" defaultValue={addDistrict} name='' required/>
                    </div>
                    <div className="subdistrict-box">
                        <span>Subdistrict</span>
                        <input type="text" defaultValue={addSubDistrict} name='' required/>
                    </div>
                    <div className="zipcode-box">
                        <span>Zip-Code</span>
                        <input type="text" defaultValue={addZipCode} name='' required/>
                    </div>
                    <div className="submit-box">
                        <input className='btn' type="submit" value="Update"/>
                    </div>
                </form>
                

            </div>
        </>
    )
}

export default Edit;