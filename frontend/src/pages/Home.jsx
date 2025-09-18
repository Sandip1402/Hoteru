import { useState, useEffect } from "react";
import { apiFetch } from "../js/api.js";
import { Slide } from "../components/Slide.jsx";
import { New } from "../components/New.jsx";

export const Home = () => {

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchItem = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await apiFetch('/listings', { method: "GET" });
                setListings(res.data);
            } catch (err) {
                setError("Failed to load hotels 😢");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!listings) return <p>No listing found</p>;


    return (
        <>
            <div className="py-2 w-full flex-col">
                <div className="w-full px-3">
                    <p className="text-xl mb-2"><b>Homes</b></p>
                    <Slide items={listings} />
                </div>
            </div>
        </>
    )
}
