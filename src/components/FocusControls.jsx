import React, { useEffect, useState } from 'react';
import { getFocus, moveFocus, MIN_FOCUS_DELTA, MAX_FOCUS_DELTA } from '../apiClient';


function FocusControls() {

    const [focusDelta, setFocusDelta] = useState(0);
    const [focusDisplay, setFocusDisplay] = useState(0);
    const [errorDisplay, setErrorDisplay] = useState('');

    useEffect(() => {
        getFocus().then((data) => {
            setFocusDisplay(data);
        });
    }, []);

    function handlePlusFocus() {
        if (Math.abs(focusDelta) > MAX_FOCUS_DELTA || Math.abs(focusDelta) < MIN_FOCUS_DELTA) {
            setErrorDisplay('Error: Focus delta too large or small');
            return;
        }
        setErrorDisplay('');
        setFocusDisplay(`Moving focus by ${focusDelta}`)
        moveFocus(focusDelta).then((_) => {
            getFocus().then((value) => setFocusDisplay(value));
        });
    }

    const handleMinusFocus = () => {
        if (Math.abs(focusDelta) > MAX_FOCUS_DELTA || Math.abs(focusDelta) < MIN_FOCUS_DELTA) {
            setErrorDisplay('Error: Focus delta too large or small');
            return;
        }
        setErrorDisplay('');
        setFocusDisplay(`Moving focus by ${-focusDelta}`)
        moveFocus(-focusDelta).then((_) => {
            getFocus().then((value) => setFocusDisplay(value));
        });
    }

    return (
    <fieldset className="manualFocus">
      <legend>Manual Focus</legend>
      <p>Current focuser position: {focusDisplay}</p>
      <p>{errorDisplay}</p>
      <br />
      <button className="temp-set minusFocusButton" onClick={handleMinusFocus}>-</button>
      <input type="number" placeholder={0} style={{ width: "60px"}} onChange={(e) => setFocusDelta(Number(e.target.value))}/>
      <button className="temp-set" onClick={handlePlusFocus}>+</button>
    </fieldset>
    )
}

export default FocusControls;