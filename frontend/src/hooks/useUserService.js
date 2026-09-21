import { useAPI } from "../hooks/useAPI";

export const useUserService = () => {
    const callAPI = useAPI();
    
    const updateUser = async (data) => {
        return callAPI(
            "/users/update",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
            true
        );
    };

    const updateProfileImage = async (file) => {
        const formData = new FormData();

        formData.append("image", file);

        return callAPI(
            "/users/profile-image",
            {
                method: "PATCH",
                body: formData,
            },
            true
        );
    };

    return {
        updateUser,
        updateProfileImage,
    };
};