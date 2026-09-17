export const DateInput = ({ name, id, value, style = "", setDate }) => {
    return (
        <span className={`flex min-w-0 flex-col ${style}`}>
            <label
                htmlFor={id}
                className="text-xs font-semibold text-text"
            >
                {name}
            </label>

            <input
                id={id}
                name={id}
                type="date"
                className="
                    mt-1 w-full min-w-0
                    border-0 bg-transparent p-0
                    text-[13px] text-text
                    focus:outline-none
                "
                required
                onChange={(ev) => setDate(ev.target.value)}
            />
        </span>
    );
};