import React, { useEffect, useState, useMemo, useContext } from 'react';
import { UserOutlined, MailOutlined,StarOutlined  } from '@ant-design/icons';
import './OwnerProfile.css';
import { OwnerInterface } from '../../Interfaces/IOwner';
import { apiUrl, GetGenders, GetOwnerByID } from '../../services/http';
import Header from '../../components/ProductMangement/Header';
import ButtonWithImage from '../../components/ProductMangement/ButtonWithImage';
import { AppContext } from '../../App';
import { GendersInterface } from '../../Interfaces/IGender';

const OwnerProfile: React.FC = () => {
  const { logoutPopup } = useContext(AppContext)
  const [owner, setOwner] = useState<OwnerInterface | null>(null);
  const [gender,setGender] = useState<GendersInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function getOwner() {
    try {
      const res = await GetOwnerByID(1);
      setOwner(res);
    } catch (err) {
      setError('Failed to fetch owner data.');
    } finally {
      setLoading(false);
    }
  }

  const getGender= async () => {
    let res = await GetGenders();
    if (res) {
      setGender(res);
    }
  }

  const getGenderName = (genderID: number | undefined) => {
    const foundGender = gender.find(g => g.ID === genderID);
    return foundGender ? foundGender.Name : 'Unknown';
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
      {logoutPopup}
      <Header page={"profile"} />
      {/* <video autoPlay muted loop id="bg-video">
        <source src="https://cdn.coverr.co/videos/coverr-temp-yasx1c11915f-9340-4124-9c9f-805f310cc184rawvideo1video0fb119d3eaace4f639d570d2badb5203d-mp4-2723/720p.mp4" type="video/mp4" />
      </video> */}
      <div className="container">
        <div className="image-container">
          <img
            src={profileImageUrl}
            className="circular-image"
            alt="Owner Profile"
          />
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <UserOutlined style={{ fontSize: '30px', color: '#FF2E63' }} />
              </td>
              <td valign='bottom'>
                {owner?.Prefix} {owner?.FirstName} {owner?.LastName}
              </td>
            </tr>
            <tr>
              <td> <img src='/images/icon/gender.png' className='gender-image' /></td>
              <td> {getGenderName(owner?.GenderID)} </td>
            </tr>
            <tr>
              <td>
                <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
              </td>
              <td>{owner?.Email}</td>
            </tr>
            <tr>
              <td>
                <StarOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
              </td>
              <td>{owner?.AdminRole}</td>
            </tr>
          </tbody>
        </table>
        {/* <div className="btn-manage-container">
          <input type='button' value='จัดการบิล' className='btn-ManageBill' onClick={() => window.location.href = '/ProductManagement'} />
          <input type='button' value='จัดการแอดมิน' className='btn-ManageAdmin' onClick={() => window.location.href = '/'} />
        </div> */}
        <ButtonWithImage />
      </div>

    </>
  );
};

export default OwnerProfile;
