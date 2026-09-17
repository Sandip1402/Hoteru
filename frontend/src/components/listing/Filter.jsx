export const Filter = ({ name, setState }) => {
  const { expand, setExpand } = setState;

  return (
    <button
      type="button"
      className={`
        flex w-full items-center rounded-lg px-3 py-2.5
        text-left transition
        ${
          expand
            ? "bg-gray-50 text-text"
            : "text-text hover:bg-gray-50"
        }
      `}
      onClick={() => setExpand(!expand)}
    >
      <span className="flex-1 text-sm font-semibold">
        {name}
      </span>

      <img
        src="/Icons/chevron_right.svg"
        alt=""
        className={`
          h-4 w-4 transition-transform duration-300
          ${expand ? "rotate-90" : ""}
        `}
      />
    </button>
  );
};