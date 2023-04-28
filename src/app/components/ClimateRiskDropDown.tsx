import React from "react";

interface DropdownProps {
    label: string;
    options: string[];
    selectedOption: string;
    setSelectedOption: (value: string) => void;
  }
  
export const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedOption, setSelectedOption }) => {
    return (
        <div className="flex items-center p-2">
            <label className="mr-2 text-black">{label}: </label>
            <select className="text-black border rounded-md p-1" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <option value="">All</option>
                {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
                ))}
            </select>
        </div>
    );
};