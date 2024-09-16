import { Form, Select } from 'antd';
import './Select.css';
import { useState, useEffect } from 'react';
import { CategoryInterface } from '../../Interfaces/ICategory';
import { GetCategories } from '../../services/http';

const { Option } = Select;

interface SelectCategoryProps {
    onCategoryChange: (category: string) => void;
}

function SelectCategory({ onCategoryChange }: SelectCategoryProps) {
    const [categories, setCategories] = useState<CategoryInterface[]>([]);

    const getCategories = async () => {
        try {
            const res = await GetCategories();
            if (res) {
                setCategories(res);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        getCategories(); 
    }, []); 

    return (
        <div className="SelectCate">
            <Form layout="inline">
                <Form.Item name="category" label="Category">
                    <Select 
                        placeholder="Select Product Category"
                        onChange={value => onCategoryChange(value)}
                    >
                        {categories.length > 0 ? (
                            categories.map((item) => (
                                <Option value={item.ID?.toString()} key={item.ID ?? ''}>
                                    {item.CategoryName}
                                </Option>
                            ))
                        ) : (
                            <Option value="">No categories found</Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </div>
    );
}

export default SelectCategory;
