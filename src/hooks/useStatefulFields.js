//hooks/useStateFields
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
//hooks must start with the word use
export function useStatefulFields() {
    const [values, setValues] = useState({});

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    return [values, handleChange];
}
