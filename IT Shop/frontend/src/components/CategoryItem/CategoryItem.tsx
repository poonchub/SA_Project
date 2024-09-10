import { apiUrl } from "../../services/http";
import "./CategoryItem.css"
import "./Categoryitem-half.css"

function CategoryItem(props: { category: any; mode: any; categoryClick: any; setCategoryClick: any; }){
    
    const {category, mode, categoryClick, setCategoryClick} = props;

    const imageUrl = `${apiUrl}/${category.ImagePath}`

    // จัดการการเปลี่ยนโหมด Sidebar
    if(mode=="half"){
        const con_cat = document.querySelector(".container-cat-item")
        con_cat?.setAttribute("class", "container-cat-item-half _cat")
    }
    else{
        const con_cat = document.querySelector(".container-cat-item-half")
        con_cat?.setAttribute("class", "container-cat-item _cat")
    }

    // จัดการการแสดงผลของ element เมื่อ click
    const allElements = document.querySelectorAll("._cat")
    const clickNowElement = document.querySelector(`#c_${categoryClick}`)
    const allProBtn = document.querySelector("#allpro-Btn")

    if(clickNowElement!=null && allElements!=null){
        allElements.forEach((item) => {
            // @ts-ignore
            item.style.borderColor = "transparent"
        })
        // @ts-ignore
        clickNowElement.style.borderColor = "var(--subtheme-color1)"
    }
    else {
        allElements.forEach((item) => {
            // @ts-ignore
            item.style.borderColor = "transparent"
            if (allProBtn){
                // @ts-ignore
                allProBtn.style.borderColor =  "var(--subtheme-color1)"
            }
            
        })
    }
        
    return (
        <div className="container-cat-item _cat" id={`c_${category.ID}`} onClick={() => setCategoryClick(category.ID)}>
            <div className="img-box">
                <img src={imageUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{category.CategoryName}</h4>
            </div>
        </div>
    )
}

export default CategoryItem;