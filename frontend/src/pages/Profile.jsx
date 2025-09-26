import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useApiFetch } from "../util/api";


export const Profile = () => {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    let { userId } = useParams();
    const apiFetch = useApiFetch();

    useEffect(() => {
        
        const getUser = async() => {
            try {
                
                const res = await apiFetch(`/user/${userId}`, {
                    method: "GET",
                }, true)
                setUser(res.data);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        getUser();
    }, [])

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!user) return <p>No data found</p>;

  return (
    <div>Profile</div>
  )
}
