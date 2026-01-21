
import React from 'react';

interface EditableProps {
  value: string;
  field: string;
  onBlur: (key: string, value: string) => void;
  className?: string;
}

const Editable: React.FC<EditableProps> = ({ value, field, onBlur, className = '' }) => {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      onBlur={(e: any) => onBlur(field, e.target.innerText)}
      className={`outline-none focus:ring-2 focus:ring-offset-4 focus:ring-indigo-500 rounded px-1 -mx-1 transition-all inline-block ${className}`}
    >
      {value}
    </span>
  );
};

export default Editable;
