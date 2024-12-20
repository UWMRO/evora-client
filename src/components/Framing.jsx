import { useState, useEffect } from 'react';
import React from "react";

// const backendUrl = 'http://localhost:3005';
const backendUrl = '/api'


function Framing(isDisabled) {
    const [filename, setFilename] = useState('');
    const [solvingResult, setSolvingResult] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const [positionHint, setPositionHint] = useState({
        hintRaDeg: '',
        hintDecDeg: '',
        hintRadiusDeg: 5 // Default value of 5
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPositionHint({
            ...positionHint,
            [name]: value
        });
    };

    const handleFilenameChange = (event) => {
        setFilename(event.target.value);
    };

    const handleSendButtonClick = () => {
        setLoading(true); // Set loading state to true when request starts
        fetch(`${backendUrl}/api/plate_solve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: filename,
                hint_ra_deg: positionHint.hintRaDeg,
                hint_dec_deg: positionHint.hintDecDeg,
                hint_radius_deg: positionHint.hintRadiusDeg
            })
        })
        .then(response => {
            setLoading(false); // Set loading state to false when request completes
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
            setLoading(false); // Set loading state to false in case of error
            console.error('Error sending request to backend:', error);
            const clickableLink = `Plate solving failed.`;
            setSolvingResult(clickableLink);
        });
    };

    return (
        <fieldset className="framing">
            <legend>Framing</legend>

            <div>
                <label htmlFor="filename">File name:</label>
                <input
                    type="text"
                    id="filename"
                    value={filename}
                    onChange={handleFilenameChange}
                    style={{ width: "300px" }} // Adjusted width
                />
                <div>
                    <label>
                        RA (deg):
                        <input
                            type="number"
                            name="hintRaDeg"
                            value={positionHint.hintRaDeg}
                            onChange={handleInputChange}
                            style={{ width: "60px" }}
                        />
                    </label>
                    &nbsp; {/* Add space between RA and Dec */}
                    <label>
                        Dec (deg):
                        <input
                            type="number"
                            name="hintDecDeg"
                            value={positionHint.hintDecDeg}
                            onChange={handleInputChange}
                            style={{ width: "60px" }}
                        />
                    </label>
                    &nbsp; { }
                    <label>
                        Radius (deg):
                        <input
                            type="number"
                            name="hintRadiusDeg"
                            value={positionHint.hintRadiusDeg}
                            onChange={handleInputChange}
                            style={{ width: "60px" }}
                        />
                    </label>
                </div>
                {/* Conditional rendering based on loading state */}
                {loading ? (
                    <button style={{backgroundColor: 'gray'}}> {/* Apply gray style when loading */}
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Working on it...
                    </button>
                ) : (
                    <button className="temp-set" onClick={handleSendButtonClick}>Plate solve</button>
                )}
            </div>

            <div>
                <style>{'a { color: white; }'}</style>
                <div dangerouslySetInnerHTML={{ __html: solvingResult }} />
            </div>
        </fieldset>
    );
}

export default Framing;
