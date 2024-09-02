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
    category: null,
    setCategory: (param: any) => {},
})

function Product(){
    const [searchText, setSearchText] = useState("");
    const [minRange, setMinRange] = useState(0);
    const [maxRange, setMaxRange] = useState(100000);
    const [mode, setMode] = useState("")
    const [category, setCategory] = useState(null)

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
            category,
            setCategory
        }}>
            <Header page={"product"} />
            <Sidebar/>
            <ShowProduct/>
        </Context.Provider>
    )
}

export default Product;