import React, { useEffect, useState, useMemo } from 'react';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import './OwnerProfile.css';  
import { OwnerInterface } from '../../Interfaces/IOwner';
import { apiUrl, GetOwnerByID } from '../../services/http';
import Header from '../../components/ProductMangement/Header';

const OwnerProfile: React.FC = () => {
  const [owner, setOwner] = useState<OwnerInterface | null>(null);
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

  useEffect(() => {
    getOwner();
  }, []);

  const profileImageUrl = useMemo(() => {
    return `${apiUrl}/${localStorage.getItem("profilePath") || owner?.ProfilePath || '/images/default-profile.png'}`;
  }, [owner]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Header page={"profile"} />
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
              <td>
                <MailOutlined style={{ fontSize: '25px', color: '#FF2E63' }} />
              </td>
              <td>{owner?.Email}</td>
            </tr>
            <tr>
              <td>
                <div className="img-custom">
                  <img src='https://cdn0.iconfinder.com/data/icons/3d-dynamic-color/512/takeaway-cup-dynamic-color.png'/>
                </div>

              </td>
              <td>
                {owner?.AdminRole}
              </td>
            </tr>
          </tbody>
        </table>
        <input type='button' value='จัดการบิล' className='btn-logout'
          onClick={() => window.location.href = '/ProductManagement'} />
      </div>
    </>
  );
};

export default OwnerProfile;
