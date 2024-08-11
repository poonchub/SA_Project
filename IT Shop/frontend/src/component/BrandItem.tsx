import "../stylesheet/BrandItem.css"

function BrandItem(props: { brand: any; }){
    const {brand} = props;

    return (
        <div className="container-brand-item">
            <div className="img-box">
                <img src={brand.thumbnailUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{brand.title}</h4>
            </div>
        </div>
    )
}

export default BrandItem;