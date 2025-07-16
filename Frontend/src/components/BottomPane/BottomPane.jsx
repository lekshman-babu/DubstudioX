import React, { useState } from "react";
import "./BottomPane.css";

import enVideo from "../../assets/videos/enVideo.mp4";
import taVideo from "../../assets/videos/taVideo.mp4";
import hiVideo from "../../assets/videos/hiVideo.mp4";
import maVideo from "../../assets/videos/maVideo.mp4";
import teVideo from "../../assets/videos/teVideo.mp4";
import mrVideo from "../../assets/videos/mrVideo.mp4";

function BottomPane() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [videoElement, setVideoElement] = useState(
    <video controls>
      <source src={enVideo} type="video/mp4" />
    </video>
  );

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);

    // Dynamically update the video element based on the selected language
    if (event.target.value === "en") {
      setVideoElement(
        <video src ={enVideo}controls>
        </video>
      );
    } else if (event.target.value === "ta") {
      setVideoElement(
        <video src ={taVideo}controls>
        </video>
      );
    } else if (event.target.value === "hi") {
      setVideoElement(
        <video src ={hiVideo}controls>
        </video>
      );
    } else if (event.target.value === "ma") {
      setVideoElement(
        <video src ={maVideo}controls>
        </video>
      );
    } else if (event.target.value === "mr") {
      setVideoElement(
        <video src ={mrVideo}controls>
        </video>
      );
    } else if (event.target.value === "te") {
      setVideoElement(
        <video src ={teVideo}controls>
        </video>
      );
    }
    // Add more conditions for other languages if needed
  };

  return (
    <div className="wrap">
      <div className="holder">
        <div className="left">
          <select
            id="languageSelector"
            onChange={handleLanguageChange}
            value={selectedLanguage}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="ma">Malayalam</option>
            <option value="mr">Marathi</option>
            {/* Add more language options here */}
          </select>

          {videoElement}
        </div>
        <div className="right">
          <div className="right-header">
            <h2 style={{ fontSize: "2rem" }}>Content Platforms</h2>
            <h4 style={{ fontSize: "1.5rem", width: "70%" }}>
              Fully automated, on-demand video translation across the internet
            </h4>
            <p className="content-paragraph">
              Unlock international audiences by enabling visitors to instantly
              translate videos on your platform. Translated videos are available
              in seconds, play in-place, and retain the voice of the original
              speaker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomPane;
