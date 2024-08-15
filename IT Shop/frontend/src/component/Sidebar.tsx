import brand from "../data/brand";
import category from "../data/category";
import "../stylesheet/Sideber.css"
// import "../stylesheet/Sidebar_hidemode.css"
import BrandItem from "./BrandItem";
import CategoryItem from "./CategoryItem";

function Sidebar(){

    const categoryElements = category.map((subCategory,index) => {
        return <CategoryItem key={index} category={subCategory}/>
    })

    const brandElements = brand.map((subBrand,index) => {
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