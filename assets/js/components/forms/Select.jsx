import React from 'react';

const Select = ({name, value, error = "", label, onChange, children}) => {
    return (
        <div className={"form-group" + (error && " is-invalid")}>
            <label htmlFor={name}>{label}</label>
            <select name={name}
                    id={name}
                    className="form-control"
                    onChange={onChange}
                    value={value}
            >
                {children}
            </select>
            <p className="invalid-feedback">{error}</p>
        </div>
    );
};

export default Select;