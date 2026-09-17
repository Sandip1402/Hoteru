import { useState } from "react";
import { Filter } from "./Filter.jsx";

export const BubbleFilter = ({
  name,
  options,
  value = [],
  onChange,
  multiple = false,
}) => {
  const [expand, setExpand] = useState(false);

  const isSelected = (option) => {
    if (multiple) {
      return value.includes(option.value);
    }

    return value === option.value;
  };

  const handleSelect = (option) => {
    if (multiple) {
      const selected = value.includes(option.value);

      if (selected) {
        onChange(value.filter((id) => id !== option.value));
      } else {
        onChange([...value, option.value]);
      }

      return;
    }

    onChange(value === option.value ? "" : option.value);
  };

  return (
    <div className="w-full border-b border-border py-2">
      <Filter name={name} setState={{ expand, setExpand }} />

      {expand && (
        <div className="flex flex-wrap gap-2 px-3 pb-3 pt-2">
          {options.map((option) => {
            const selected = isSelected(option);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  rounded-full border px-3 py-1.5
                  text-xs font-medium transition
                  ${
                    selected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-white text-text-muted hover:border-primary hover:text-primary"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};