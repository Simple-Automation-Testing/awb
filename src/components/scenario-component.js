import React from 'react'

export const ScenarioComponent = ({ text, onChange, listElement }) => (
  <div>{text}{listElement && <input onChange={onChange} className="css__selector-input" />}</div>
)
