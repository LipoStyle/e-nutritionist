import React from 'react';

const InputField = ({ className, type, name, value, placeHolderMessage, onChange }) => {
  return (
    <div className={`input-field ${className}`}>
      <label htmlFor={name}>{name}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeHolderMessage}
        onChange={onChange}
        required="required"
      />
    </div>
  );
};

export default InputField;
