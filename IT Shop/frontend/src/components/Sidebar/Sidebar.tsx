import { useContext, useEffect, useState } from "react"
import { BrandInterface } from "../../Interfaces/IBrand"
import BrandItem from "../BrandItem/BrandItem"
import CategoryItem from "../CategoryItem/CategoryItem"
import "./Sidebar.css"
import "./Sidebar-half.css"
import { GetBrands, GetCategories } from "../../services/http"
import { CategoryInterface } from "../../Interfaces/ICategory"
import { Context } from "../../pages/Product"

function Sidebar(){

    const [brands, setBrands] = useState<BrandInterface[]>([]);
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const {mode, setMinRange, setMaxRange, categoryClick, setCategoryClick, brandClick, setBrandClick} = useContext(Context)

    async function getBrands(){
        let res = await GetBrands()
        if (res) {
            setBrands(res);
        }
    }
    async function getCategories(){
        let res = await GetCategories()
        if (res) {
            setCategories(res);
        }
    }

    useEffect(()=> {
        getBrands()
        getCategories()
    }, [])

    const categoryElements = categories.map((subCategory,index) => {
        return <CategoryItem key={index} category={subCategory} mode={mode} categoryClick={categoryClick} setCategoryClick={setCategoryClick}/>
    })

    const brandElements = brands.map((subBrand,index) => {
        return <BrandItem key={index} brand={subBrand} mode={mode} brandClick={brandClick} setBrandClick={setBrandClick}/>
    })

    // จัดการการเปลี่ยนโหมด Sidebar
    if (mode=="half"){
        const sidebar_con = document.querySelector(".container-sidebar")
        sidebar_con?.setAttribute('class', 'container-sidebar-half')
    }
    else {
        const sidebar_con = document.querySelector(".container-sidebar-half")
        sidebar_con?.setAttribute('class', 'container-sidebar')
    }

    // จัดการการแสดงผลของ element เมื่อ click All Product
    const allProductElement = document.querySelector(".all-product")
    if (allProductElement!=null && categoryClick!=null){
        // @ts-ignore
        allProductElement.style.borderColor = "transparent"
    }
    else if (allProductElement!=null && categoryClick==null){
        // @ts-ignore
        allProductElement.style.borderColor = "var(--subtheme-color1)"
    }

    // จัดการการแสดงผลของ element เมื่อ click All Brand
    const allBrandElement = document.querySelector(".all-brand")
    if (allBrandElement!=null && brandClick!=null){
        // @ts-ignore
        allBrandElement.style.borderColor = "transparent"
    }
    else if (allBrandElement!=null && brandClick==null){
        // @ts-ignore
        allBrandElement.style.borderColor = "var(--subtheme-color1)"
    }

    return (
        <div className="container-sidebar">
            <div className="range-box">
                <h4 className="head-ti">Range</h4>
                <div className="input-box">
                    <p className="min">Min</p>
                    <input 
                        className="min-value" 
                        type="number" 
                        defaultValue={0}
                        min={0}
                        step={500}
                        onChange={(event) => {
                            {setMinRange(event.target.value)}
                        }}
                    />
                    <p className="to">−</p>
                    <input 
                        className="max-value" 
                        type="number"
                        defaultValue={100000}
                        min={1000}
                        step={500}
                        onChange={(event) => {
                            setMaxRange(event.target.value)
                        }}
                    />
                    <p className="max">Max</p>
                </div>
            </div>
            <div className="category-box">
                <h4 className="head-ti">Category</h4>
                <div className="element-cat-box">
                    <div className="container-cat-item all-product" id="allpro-Btn" onClick={()=>setCategoryClick(null)}>
                        <div className="img-box">
                            <img src="images/icon/all-product.png" alt="" />
                        </div>
                        <div className="title-box">
                            <h4>All Product</h4>
                        </div>
                    </div>
                    {categoryElements}
                </div>
            </div>
            <div className="brand-box">
                <h4 className="head-ti">Brand</h4>
                <div className="element-brand-box">
                    <div className="container-brand-item all-brand" id="allbrand-Btn" onClick={()=>setBrandClick(null)}>
                        <div className="img-box">
                            <img src="images/icon/all-brand.png" alt="" />
                        </div>
                        <div className="title-box">
                            <h4>All Brand</h4>
                        </div>
                    </div>
                    {brandElements}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;