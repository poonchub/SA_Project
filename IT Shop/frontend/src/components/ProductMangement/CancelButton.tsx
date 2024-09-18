import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

interface CancelButtonProps {
  to: string;
}

const CancelButton: React.FC<CancelButtonProps> = ({ to }) => {
  return (
    <Link to={to}>
      <Button id="cancel-bt" type="default">
        Cancel
      </Button>
    </Link>
  );
};

export default CancelButton;
