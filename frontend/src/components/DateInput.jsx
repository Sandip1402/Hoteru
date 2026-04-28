

export const DateInput = ({name, style, setDate}) => {
    return (
        <span className={`flex-1 ${style}`}>
            <label htmlFor={name}>{`Check ${name.slice(5)}`}</label>
            <input id={name} className="input-field block w-full" type="date" onChange={(ev) => setDate(ev.target.value)} />
        </span>
    )
}