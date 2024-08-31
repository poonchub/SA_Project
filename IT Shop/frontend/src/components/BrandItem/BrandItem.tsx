import "./BrandItem.css"

function BrandItem(props: { brand: any; }){
    const {brand} = props;

    const imageUrl = `data:image/png;base64,${brand.Picture}`

    return (
        <div className="container-brand-item">
            <div className="img-box">
                <img src={imageUrl} alt="" />
            </div>
            <div className="title-box">
                <h4>{brand.Name}</h4>
            </div>
        </div>
    )
}

export default BrandItem;