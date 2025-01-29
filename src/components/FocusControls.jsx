import React, { useState } from 'react';

function FocusControls() {

    const [focus, setFocus] = useState(0);

    const handlePlusFocus = () => {
        console.log("Plus Focus");
    }

    const handleMinusFocus = () => {
        console.log("Minus Focus");
    }

    return (
    <fieldset className="manualFocus">
      <legend>Manual Focus</legend>
      <button className="temp-set minusFocusButton" onClick={handleMinusFocus}>-</button>
      <input type="number" min={0} step={0.1} style={{ width: "60px"}}/>
      <button className="temp-set" onClick={handlePlusFocus}>+</button>
    </fieldset>
    )
}

export default FocusControls;