import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";

const ReactDateTimePicker = () => {
    const [dateTime, setDateTime] = useState(new Date());

    const handleChange = (event) => {
        setDateTime(event.target.value);
    };

    return <DateTimePicker value={dateTime} onChange={handleChange} />;
};

export default ReactDateTimePicker;
