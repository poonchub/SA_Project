import "./Loading.css"

function Loading(){
    return (
        <div className="loading-container">
            <video className="video-loading" src="./videos/duck.mp4" autoPlay loop muted></video>
        </div>
    )
}

export default Loading;