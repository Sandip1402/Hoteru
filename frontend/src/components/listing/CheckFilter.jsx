import { useState } from "react";
import { Filter } from "./Filter.jsx";

export const CheckFilter = ({
  name,
  options,
  showOptions = false,
  value = "",
  onChange,
}) => {
  const [expand, setExpand] = useState(showOptions);

  return (
    <div className="w-full border-b border-border py-2">
      <Filter
        name={name}
        setState={{ expand, setExpand }}
      />

      {expand && (
        <div className="px-3 pb-2 pt-1">
          {options.map((option) => {
            const selected = value === option;

            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-text-muted"
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() =>
                    onChange?.(selected ? "" : option)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />

                <span>{option}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};