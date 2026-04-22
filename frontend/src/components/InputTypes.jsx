import { useFormContext, Controller } from "react-hook-form";

export const FormInput = ({name, label, rules, ...rest}) => {

    const {control, getValues} = useFormContext();

    return (
        <div className="mb-3">
            {label && <label className={`block mb-1 ${rest.label_classes}`} htmlFor={name}>{label}</label>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <input {...(rest.type !== "file" ? field : {})} {...rest} type={rest.type || "text"} id={name}
                            className={`border p-2 w-full ${rest.input_classes}`}
                            onChange={(e) => { if (rest.type === "file") {
                                    const newFiles = Array.from(e.target.files);
                                    const existingfiles = Array.from(getValues(name) || []);

                                    field.onChange([...newFiles, ...existingfiles]);
                                } else{ 
                                    field.onChange(e.target.value);
                                }
                            }}
                         />
                        {error && ( <p className="text-red-500 mt-1 text-sm">{error.message}</p> )}
                    </>
                )}
            />
        </div>
    )
}
