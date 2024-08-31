import "./CategoryItem.css"

function CategoryItem(props: { category: any; }){
    
    const {category} = props;

    const imageUrl = `data:image/png;base64,${category.Picture}`

    return (
        <div className="container-cat-item">
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