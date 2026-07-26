

export const DateInput = ({name, id, style, setDate}) => {
    return (
        <span className={`max-sm:flex-1 flex flex-col ${style}`}>
            <label htmlFor={id}>{name}</label>
            <input id={id} name={id} type="date" className="input-field" role="button" required
                onClick={(ev) => console.dir(ev)} onChange={(ev) => setDate(ev.target.value)} />
        </span>
    )
}
