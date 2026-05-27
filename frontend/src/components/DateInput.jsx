

export const DateInput = ({name, style, setDate}) => {
    return (
        <span className={`max-sm:flex-1 flex flex-col ${style}`}>
            <label htmlFor={name}>{`Check ${name.slice(5)}`}</label>
            <input id={name} name={name} type="date" className="input-field" role="button"
                onClick={(ev) => console.dir(ev)} onChange={(ev) => setDate(ev.target.value)} />
        </span>
    )
}
