import "../stylesheet/CategoryItem.css"

function CategoryItem(props: { category: any; }){
    const {category} = props;

    return (
        <div className="container-cat-item">
            <div className="img-box">
                <img src={category.thumbnailUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{category.title}</h4>
            </div>
        </div>
    )
}

export default CategoryItem;