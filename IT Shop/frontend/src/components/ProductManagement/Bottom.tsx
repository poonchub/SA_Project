import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Bottom.css';
import { Button } from 'antd';

interface BottomProps {
    currentPage: number;
    totalProducts: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

const Bottom: React.FC<BottomProps> = ({ currentPage, totalProducts, pageSize, onPageChange }) => {
    const totalPages = Math.ceil(totalProducts / pageSize);

    return (
        <div className="nextorback" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <span className="ShowLeft">Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} entries</span>
            <div>
                <Button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    <LeftOutlined />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button 
                        key={index} 
                        className={`new-page-btn ${index + 1 === currentPage ? 'custom-btn2' : 'custom-btn'}`} 
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    <RightOutlined />
                </Button>
            </div>
        </div>
    );
}
export default Bottom;
