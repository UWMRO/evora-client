import { useState, useEffect } from 'react';
import React from "react";

// const backendUrl = 'http://localhost:3005';
const backendUrl = '/api'


function Focus() {
  const [focuserPosition, setFocuserPosition] = useState('');
  const [filename, setFilename] = useState('');
  const [sid, setSid] = useState('');
  const [img, setImg] = useState();

  const refreshSid = () => {
    // Generate a timestamp session id
    const sessionId = Date.now().toString();
    setSid(sessionId);
  };

  useEffect(() => {
    refreshSid();
  }, []);

  const handleFilenameChange = (event) => {
    setFilename(event.target.value);
  };
  
  const handleFocuserPositionChange = (event) => {
    setFocuserPosition(event.target.value);
  };

  const handleSendButtonClick = () => {
    // Send request to backend with focuserPosition and filename
    console.log(`Sending request to backend with focuserPosition: ${focuserPosition} and filename: ${filename}`);

    fetch(`${backendUrl}/api/add_focus_datapoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sid, focuserPosition, filename })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from backend:', data);
        fetchPlot();
      })
      .catch(error => {
        console.error('Error sending request to backend:', error);
      });
  };

  const fetchPlot = async () => {
    const res = await fetch(`${backendUrl}/plot/${sid}`, {
    });
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  };

  const handleResetButtonClick = () => {
    // Send request to backend to analyze data
    console.log('Sending request to backend to analyze data');

    fetch(`${backendUrl}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sid
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Response from backend:', data);
        setImg(null);
        refreshSid();
      })
      .catch(error => {
        console.error('Error sending request to backend:', error);
        refreshSid();
      });
  };

  return (
    <fieldset className="focus">
      <legend>Focus</legend>
      <div>
        <label htmlFor="filename">File name:</label>
        <input type="text" id="filename" value={filename} onChange={handleFilenameChange} />
        <label htmlFor="focuserPosition">Focuser Position:</label>
        <input type="text" id="focuserPosition" value={focuserPosition} onChange={handleFocuserPositionChange} />
        <button className="temp-set"onClick={handleSendButtonClick}>Send</button>
      </div>
      <button className="temp-set"onClick={handleResetButtonClick}>Reset</button>
      {img && (
        <img src={img} alt="An example image" />
      )}
    </fieldset>
  );
}

export default Focus;
