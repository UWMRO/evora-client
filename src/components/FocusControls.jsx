import React, { useEffect, useState } from 'react';
import { getFocus, setFocus } from '../apiClient';


function FocusControls() {

    const [focusDelta, setFocusDelta] = useState(0);
    const [focusDisplay, setFocusDisplay] = useState(0);

    useEffect(() => {
        getFocus().then((data) => {
            setFocusDisplay(data.focus);
        });
    }, []);

    function handlePlusFocus() {
        getFocus().then((data) => {
            const actualFocus = Number(data.focus);
            console.log(actualFocus);
            setFocus(actualFocus + focusDelta);
            setFocusDisplay(actualFocus + focusDelta);
        });
    }

    const handleMinusFocus = () => {
        getFocus().then((data) => {
            const actualFocus = Number(data.focus);
            console.log(actualFocus);
            setFocus(actualFocus - focusDelta);
            setFocusDisplay(actualFocus - focusDelta);
        });
    }

    return (
    <fieldset className="manualFocus">
      <legend>Manual Focus</legend>
      <p>Current focuser position: {focusDisplay}</p>
      <br />
      <button className="temp-set minusFocusButton" onClick={handleMinusFocus}>-</button>
      <input type="number" placeholder={0} min={500} step={100} style={{ width: "60px"}} onChange={(e) => setFocusDelta(Number(e.target.value))}/>
      <button className="temp-set" onClick={handlePlusFocus}>+</button>
    </fieldset>
    )
}

export default FocusControls;