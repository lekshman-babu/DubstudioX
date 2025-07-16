import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Summarise() {
    const [file, setFile] = useState(null);
    const [source, setSource] = useState("English");
    const [target, setTarget] = useState();

  const handleSubmit = () => {
    //same logic
    //file has to be sent to server along with source and target
    //server will return the translated text
    //this text can be requested to openAI to summarise
    //openAI can be done from the server itself refer  https://github.com/Pratosh22/yotube-tldr-backend line 34-56
    //display the text in the summarise component
    
  };
    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
}
  const handleTargetChange = (e) => {
    setTarget(e.target.value);
}
  return (
    <div>
      <form className="card form" onSubmit={handleSubmit}>
        <div className="top">
          <div className="file">
            <label htmlFor="">Upload video</label>
            <input type="file" name="" id="" onChange={handleFileChange} />
          </div>
        </div>
        <div className="bottom">
          <div className="label-el">
            <label htmlFor="">Source Language</label>
            <select name="" id="">
              <option value="English">English</option>
            </select>
          </div>

          <div className="label-el">
            <label htmlFor="">Target Language</label>
            <select name="" id="" onChange={handleTargetChange}>
              <option value="Tamil">Tamil</option>
              <option value="Hindi">Hindi</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Summarise;
