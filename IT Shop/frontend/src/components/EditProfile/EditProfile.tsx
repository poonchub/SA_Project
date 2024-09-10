import "./EditProfile.css"
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Upload
  } from 'antd';

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

function NewEdit(){

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
                        <input type="text" name='' required/>
                    </div>
                    <div className="lname-box">
                        <span>Last Name</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="birthday-box">
                        <span>Birthday</span>
                        <input type="date" name='' required/>
                    </div>
                    <div className="email-box">
                        <span>Email</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="password-box">
                        <span>Password</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="address-box">
                        <span>Address</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="province-box">
                        <span>Province</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="district-box">
                        <span>District</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="subdistrict-box">
                        <span>Subdistrict</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="zipcode-box">
                        <span>Zip-Code</span>
                        <input type="text" name='' required/>
                    </div>
                    <div className="submit-box">
                        <input className='btn' type="submit" value="Update"/>
                    </div>
                </form>
                

            </div>
        </>
    )
}

export default NewEdit;