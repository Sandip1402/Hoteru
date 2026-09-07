import { useAPI } from "./useAPI";

export const useHostService = () => {
    const callAPI = useAPI();

    const getHostProfile = async () => {
        return callAPI(
            "/host-requests/profile",
            {
                method: "GET",
            },
            true
        );
    };

    return {
        getHostProfile,
    }
}