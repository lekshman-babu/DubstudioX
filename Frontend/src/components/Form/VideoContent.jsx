import "./VideoContent.css";
import utf8 from "utf8";

function VideoContent({videoUrl, handleDeleteClick,targetTxt}) { 

  // Decode the buffer using iconv-lite
  
  const decodedText = utf8.decode(targetTxt);
    
return <div className="video-container">
            <h2>Converted Video</h2>
            <video controls width="640" height="360">
              <source src={videoUrl} type="video/mp4" />
            </video>
            <h5>
              {decodedText}</h5>
            <button onClick={handleDeleteClick} className="delete-button">
              X
            </button>
          </div>
}

export default VideoContent;