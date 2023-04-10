import React, { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import "../muiAutocomplete.css";

const CustomDateTimePicker = ({ selectedDateTime, setSelectedDateTime }) => {
    return (
        <DateTimePicker
            className="MuiAutocomplete-popup"
            label="Start date & start time"
            value={selectedDateTime}
            onChange={(value) => {
                setSelectedDateTime(value);
            }}
        />
    );
};

export default CustomDateTimePicker;
