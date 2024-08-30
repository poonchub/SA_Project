import "./SmallImage.css"

function SmallImage(props: { picture: any; setMainImg: any; }){

    const {picture, setMainImg} = props

    const imageUrl = `data:image/png;base64,${picture.File}`

    return (
        <div className="smallimage-container" onClick={()=>setMainImg(imageUrl)}>
            <img src={imageUrl} alt="" />
        </div>
    )
}

export default SmallImage;