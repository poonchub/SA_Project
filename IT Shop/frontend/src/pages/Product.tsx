import { createContext,useContext,useState } from "react";
import Header from "../components/Header/Header"
import Sidebar from "../components/Sidebar/Sidebar";
import ShowProduct from "../components/ShowProduct/ShowProduct";
import { AppContext } from "../App";

export const Context = createContext<{
    searchText: string,
    setSearchText: (param: any) => void,
    mode: string,
    setMode: (param: any) => void,
    minRange: number,
    setMinRange: (param: any) => void,
    maxRange: number,
    setMaxRange: (param: any) => void,
    categoryClick: null,
    setCategoryClick: (param: any) => void,
    brandClick: null,
    setBrandClick: (param: any) => void,
}>({
    searchText: "",
    setSearchText: () => {},
    mode: "null",
    setMode: () => {},
    minRange: 0,
    setMinRange: () => {},
    maxRange: 100000,
    setMaxRange: () => {},
    categoryClick: null,
    setCategoryClick: () => {},
    brandClick: null,
    setBrandClick: () => {},
})

function Product(){
    const [searchText, setSearchText] = useState("");
    const [minRange, setMinRange] = useState(0);
    const [maxRange, setMaxRange] = useState(100000);
    const [mode, setMode] = useState("")
    const [categoryClick, setCategoryClick] = useState(null)
    const [brandClick, setBrandClick] = useState(null)
    const {logoutPopup} = useContext(AppContext)

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
            setBrandClick,
        }}> 
            {logoutPopup}
            <Header page={"product"} />
            <Sidebar/>
            <ShowProduct/>
        </Context.Provider>
    )
}

export default Product;