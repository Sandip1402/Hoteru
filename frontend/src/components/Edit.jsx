import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "./FormField";
import { FormInput } from "./FormInput";
import { validateFiles } from "../js/validateFiles";
import { TbCameraPlus } from "react-icons/tb";
import { apiFetch } from "../js/api";

export const Edit = ({listing}) => {

    const methods = useForm({
        defaultValues: listing,
    });
    const { handleSubmit, reset } = methods;

    const saveData = async(data) => {
        console.log(data);
        const payload = { listing: data };
        const res = await apiFetch(`/listings/${data._id}`, {
            method : "PUT",
            body: JSON.stringify(payload)
        })

        if(!res.success){
            console.log("Failed to save data. Try again");
        }else{
            console.log("Data saved");
        }
        navigate(`/info/${listing._id}`);
    }

    return (
        <FormProvider {...methods}>
            <form className="max-w-md mx-auto m-4 p-6 bg-white rounded-lg shadow-lg select-none" onSubmit={handleSubmit(saveData)}>
                <h3 className="text-xl font-bold mb-6 text-center">Update Listing Details</h3>
                <FormInput name="title" label="Title" placeholder="Ex:SeaSide hotel"
                    rules={{ required: "*Title is required" }} />

                <FormField name="description" label="Description" placeholder="Ex:hotel with nice view and service"
                    rules={{ required: "*Description is required" }} />
                <div className="sm:flex justify-between gap-2">
                    <FormInput name="price" label="Price/Night" type="number" placeholder="Ex:2000"
                        rules={{
                            required: "*Enter valid price",
                            min: {
                                value: 100, message: "*Price must be at least 100"
                            }
                        }} />
                    <FormInput name="country" label="Country" type="text" placeholder="Ex:India"
                        rules={{ required: "*Please provide country name" }} />
                </div>

                <FormInput name="location" label="Enter location" placeholder="Ex:Mumbai juhu beach"
                    rules={{ required: "*Please provide country name" }} />

                <FormInput name="images" label={<TbCameraPlus />} type="file" multiple
                    accept="image/jpeg, image/png, image/jpg"
                    input_classes="hidden"
                    label_classes="image-input"
                    rules={{ validate: validateFiles }} />

                <button type="submit" className="bg-blue-600 text-white w-full px-4 py-2 rounded">Update</button>
            </form>
        </FormProvider>
    )
}

