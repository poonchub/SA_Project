import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import './NavBar.css';
import SearchBox from './SearchBox';
import SelectBrand from './SelectBrand'
import SelectCategory from './SelectCategory';
import { Link } from 'react-router-dom';
const NavBar: React.FC = () => {
  return (   
      <div className="navbar-container">
        <span className='Search-Product'>
          <SearchBox />
        </span>
        <div className='filter-Content'>
          <div className='SelectBC'>
            <div className='Select-Brand'>
              <SelectBrand />
            </div>
            <div className='Select-Brand'>
              <SelectCategory />
            </div>
            
            
          </div> 
      
          <Link to="/Product/Create">
            <button className="new-product-btn">
            <PlusOutlined style={{ marginRight: '8px' }} /> New Product
          </button>
          </Link>
          
        </div>       
       
    
    </div>

    
  );
};

export default NavBar;
