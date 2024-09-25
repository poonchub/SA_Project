import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

interface CancelButtonProps {
  to: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ to }) => {
  const [loading, setLoading] = useState(false); 

  const handleCancel = () => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false); 
      window.location.href = to; 
    }, 650); 
  };

  return (
    <Button
      id="cancel-bt"
      type="default"
      loading={loading} 
      onClick={handleCancel} 
    >
      ยกเลิก
    </Button>
  );
};

export default CancelButton;
