import { Form, Select } from 'antd';
import './Select.css'
import { useEffect, useState } from 'react';
import { GetBrands } from '../../services/http';
import { BrandInterface } from '../../Interfaces/IBrand';

const { Option } = Select;

interface SelectBrandProps {
    onBrandChange: (brand: string) => void;
}

function SelectBrand({ onBrandChange }: SelectBrandProps) {
    const [brands, setBrands] = useState<BrandInterface[]>([]);

    const getBrands = async () => {
        try {
            const res = await GetBrands();
            if (res) {
                setBrands(res);
            }
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        }
    };

    useEffect(() => {
        getBrands(); 
    }, []); 

    return (
        <div className="SelectBrand">
            <Form layout="inline">
                <Form.Item name="brand" label="Brand">
                    <Select 
                        placeholder="Select Product Brand"
                        onChange={value => onBrandChange(value)}
                    >
                        {brands.length > 0 ? (
                            brands.map((item) => (
                                <Option value={item.ID?.toString()} key={item.ID ?? ''}>
                                    {item.BrandName}
                                </Option>
                            ))
                        ) : (
                            <Option value="">No brands found</Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    );
}

export default SelectBrand;
