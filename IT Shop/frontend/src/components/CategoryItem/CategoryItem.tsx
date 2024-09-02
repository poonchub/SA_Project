import "./CategoryItem.css"
import "./Categoryitem-half.css"

function CategoryItem(props: { category: any; mode: any; setCategory: any; }){
    
    const {category, mode, setCategory} = props;

    const imageUrl = `data:image/png;base64,${category.Picture}`

    if(mode=="half"){
        const con_cat = document.querySelector(".container-cat-item")
        con_cat?.setAttribute("class", "container-cat-item-half")
    }
    else{
        const con_cat = document.querySelector(".container-cat-item-half")
        con_cat?.setAttribute("class", "container-cat-item")
    }

    return (
        <div className="container-cat-item" onClick={() => setCategory(category.ID)}>
            <div className="img-box">
                <img src={imageUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{category.Name}</h4>
            </div>
        </div>
    )
}

export default CategoryItem;