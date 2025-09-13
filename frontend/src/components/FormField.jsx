import { useFormContext, Controller } from "react-hook-form";

export const FormField = ({name, label, rules, ...rest }) => {

    const {control} = useFormContext();

    return (
        <div className="mb-3">
            {label && <label className="block mb-1" htmlFor={name}>{label}</label>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <textarea {...field} {...rest} id={name} className="border p-2 w-full" />
                        {error && ( <p className="text-red-500 text-sm mt-1">{error.message}</p> )}
                    </>
                )}
            />
        </div>
    )
}
