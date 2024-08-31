import { useEffect, useState } from "react"
import { BrandInterface } from "../../Interfaces/IBrand"
import BrandItem from "../BrandItem/BrandItem"
import CategoryItem from "../CategoryItem/CategoryItem"
import "./Sidebar.css"
import { GetBrands, GetCategories } from "../../services/http"
import { CategoryInterface } from "../../Interfaces/ICategory"

function Sidebar(){

    const [brands, setBrands] = useState<BrandInterface[]>([]);
    const [categories, setCategories] = useState<CategoryInterface[]>([]);

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
        return <CategoryItem key={index} category={subCategory}/>
    })

    const brandElements = brands.map((subBrand,index) => {
        return <BrandItem key={index} brand={subBrand}/>
    })

    return (
        <div className="container-sidebar">
            <div className="range-box">
                <h4 className="head-ti">Range</h4>
                <div className="input-box">
                    <p className="min">Min</p>
                    <input className="min-value" type="number" min={0}/>
                    <p className="to">−</p>
                    <input className="max-value" type="number" min={0}/>
                    <p className="max">Max</p>
                </div>
            </div>
            <div className="category-box">
                <h4 className="head-ti">Category</h4>
                <div className="element-cat-box">
                    {categoryElements}
                </div>
            </div>
            <div className="brand-box">
                <h4 className="head-ti">Brand</h4>
                <div className="element-brand-box">
                    {brandElements}
                </div>
            </div>
        </div>
    )
}

export default Sidebar;