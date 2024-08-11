import "../stylesheet/SmallImage.css"

function SmallImage(props: any){

    const {product} = props

    return (
        <div className="smallimage-container">
            <img src={product} alt="" />
        </div>
    )
}

export default SmallImage;