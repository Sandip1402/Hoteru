import { useState } from "react";
import { Filter } from "./Filter.jsx";

export const RangeFilter = ({
  name,
  minVal = 1,
  maxVal,
  value,
  onChange,
}) => {
  const [expand, setExpand] = useState(false);

  const currentValue = value ?? minVal;

  return (
    <div className="w-full border-b border-border py-2">

      <Filter
        name={name}
        setState={{ expand, setExpand }}
      />

      {expand && (
        <div className="px-3 pb-3 pt-2">

          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-text-muted">
              Maximum price
            </span>

            <span className="text-sm font-semibold text-text">
              ₹{currentValue}
            </span>
          </div>

          <input
            type="range"
            min={minVal}
            max={maxVal}
            step={1}
            value={currentValue}
            onChange={(ev) =>
              onChange?.(Number(ev.target.value))
            }
            className="w-full accent-primary"
          />

          <div className="mt-1 flex justify-between text-[11px] text-text-light">
            <span>₹{minVal}</span>
            <span>₹{maxVal}</span>
          </div>

        </div>
      )}
    </div>
  );
};