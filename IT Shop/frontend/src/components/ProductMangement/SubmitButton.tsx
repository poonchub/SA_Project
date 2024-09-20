import React from 'react';
import { Button } from 'antd';

interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading }) => {
  return (
    <Button
      id="submit-bt"
      type="primary"
      htmlType="submit"
      loading={loading}
    >
      Submit
    </Button>
  );
};

export default SubmitButton;
