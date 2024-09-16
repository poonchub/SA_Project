import { useState } from 'react';
import './SearchBox.css';
import SelectCategory from './SelectCategory';
import SelectBrand from './SelectBrand';

interface SearchBoxProps {
    onSearch: (searchTerm: string) => void;
    onCategoryChange: (category: string) => void;
    onBrandChange: (brand: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, onCategoryChange, onBrandChange }) => { 
    const [searchTerm, setSearchTerm] = useState<string>("");

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            onSearch(searchTerm);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="serch-contrainer">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="ค้นหาด้วย ID หรือชื่อสินค้า"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}  
                    className='search-input'
                />
                <div className="img-box" onClick={handleSearch}>
                    <img src="/images/icon/search.png" alt="Search icon" />
                </div>
            </div>
            <div className="selected-but">
                {/* Use the passed onBrandChange and onCategoryChange props */}
                <SelectBrand onBrandChange={onBrandChange} /> 
                <SelectCategory onCategoryChange={onCategoryChange} />
            </div>     
        </div>
    );
};

export default SearchBox;
