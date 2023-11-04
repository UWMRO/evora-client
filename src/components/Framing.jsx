import { useState, useEffect } from 'react';
import React from "react";

// const backendUrl = 'http://localhost:3005';
const backendUrl = '/api'


function Framing(isDisabled) {
    const [filename, setFilename] = useState('');
    const [solvingResult, setSolvingResult] = useState('');

    const handleFilenameChange = (event) => {
        setFilename(event.target.value);
    };

    const handleSendButtonClick = () => {
        fetch(`${backendUrl}/api/plate_solve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from backend:', data);

            if (data.status !== 'success') {
                setSolvingResult(`${data.failure_reason}`);

            } else {
                const link = data.visualization_url;
                const ra = data.center_ra_deg.toFixed(4);
                const dec = data.center_dec_deg.toFixed(4);
                const clickableLink = `<a href="${link}" target="_blank">RA ${ra}, DEC ${dec}</a>`;

                setSolvingResult(clickableLink);
            }
        })
        .catch(error => {
            console.error('Error sending request to backend:', error);
            const clickableLink = `Plate solving failed.`;
            setSolvingResult(clickableLink);
        });
    };

    return (
        <fieldset className="Framing">
            <legend>Framing</legend>

            <div>
                <label htmlFor="filename">File name:</label>
                <input type="text" id="filename" value={filename} onChange={handleFilenameChange} />
                <button onClick={handleSendButtonClick}>Plate solve</button>
            </div>

            <div>
                <style>{'a { color: white; }'}</style>
                <div dangerouslySetInnerHTML={{ __html: solvingResult }} />
            </div>
        </fieldset>
    );
}


export default Framing;

