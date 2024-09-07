import { createContext,useState } from "react";
import Header from "../components/Header/Header"
import Sidebar from "../components/Sidebar/Sidebar";
import ShowProduct from "../components/ShowProduct/ShowProduct";

export const Context = createContext({
    searchText: "",
    setSearchText: (param: any) => {},
    mode: "",
    setMode: (param: any) => {},
    minRange: 0,
    setMinRange: (param: any) => {},
    maxRange: 100000,
    setMaxRange: (param: any) => {},
    categoryClick: null,
    setCategoryClick: (param: any) => {},
    brandClick: null,
    setBrandClick: (param: any) => {},
})

function Product(){
    const [searchText, setSearchText] = useState("");
    const [minRange, setMinRange] = useState(0);
    const [maxRange, setMaxRange] = useState(100000);
    const [mode, setMode] = useState("")
    const [categoryClick, setCategoryClick] = useState(null)
    const [brandClick, setBrandClick] = useState(null)

    return (
        <Context.Provider value={{
            searchText,
            setSearchText, 
            mode, 
            setMode,
            minRange,
            setMinRange,
            maxRange,
            setMaxRange,
            categoryClick,
            setCategoryClick,
            brandClick,
            setBrandClick
        }}>
            <Header page={"product"} />
            <Sidebar/>
            <ShowProduct/>
        </Context.Provider>
    )
}

export default Product;