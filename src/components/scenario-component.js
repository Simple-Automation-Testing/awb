import React from 'react';

export const ScenarioComponent = ({ title, text, onChange, listElement, className }) => {
  const handleChange = (e) => {
    onChange && onChange(e)
  };
  const classValue = className ? `css__selector-input-${className}` : 'css__selector-input';
  return (
    <div><span>{title}{text && text}</span>{
      !listElement && <input onChange={handleChange} className={classValue} />
    }</div>
  );
};