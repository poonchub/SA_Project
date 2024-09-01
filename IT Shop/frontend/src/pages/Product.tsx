import { createContext,useState } from "react";
import Header from "../components/Header/Header"
import Sidebar from "../components/Sidebar/Sidebar";
import ShowProduct from "../components/ShowProduct/ShowProduct";

export const SearchTextContext = createContext({
    searchText: "",
    setSearchText: (param: any) => {},
})

function Product(){

    const [icon, setIcon] = useState("/images/icon/Hamburger.png");
    const [searchText, setSearchText] = useState("");

    return (
        <SearchTextContext.Provider value={{searchText,setSearchText}}>
            <Header icon={icon}/>
            <Sidebar/>
            <ShowProduct/>
        </SearchTextContext.Provider>
    )
}

export default Product;