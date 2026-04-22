import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetchApi } from "../util/api";
import { FiHeart, FiStar, FiCircle, FiShare2, FiHome } from "react-icons/fi";



const RoomDetails = () => {
    // const navigate = useNavigate();
    // const { id } = useParams();

    // const [item, setItem] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [save, setSave] = useState(false);

    // const apiFetch = fetchApi();

    // useEffect(() => {
    //     const fetchItem = async () => {
    //         try {
    //             setLoading(true);
    //             setError(null);

    //             const res = await apiFetch(`/listings/${id}`, { method: "GET" });
    //             setItem(res.data);
    //         } catch (err) {
    //             setError("Failed to load hotel detail 😢");
    //             console.error(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchItem();
    // }, [id]);

    // if (loading) return <p className="text-center my-auto">Loading...</p>;
    // if (error) return <p className="text-red-500 text-center my-auto">{error}</p>;
    // if (!item) return <p>No listing found</p>;
    return (
        <div className="py-1 lg:px-20">

            {/* Intro */}
            <section className="my-5 flex-col">
                <b className="text-lg">Superior Family Room</b>
                <div className="flex justify-between">
                    {/*Review & place */}
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                            <FiStar strokeWidth={"0"} fill="blue" />
                            <p>3.5</p>
                            <p className="text-gray-500">(234 reviews)</p>
                        </span>
                        <span className="flex items-center gap-1">
                            <FiCircle size={6} fill="black" />
                            <p>Taito city, Tokyo, Japan</p>
                        </span>
                    </div>

                    {/*Share & save */}
                    <span className="flex items-center gap-4">
                        <span className="flex cursor-pointer items-center gap-1">
                            <FiShare2 /> <p>Share</p>
                        </span>
                        <span className="flex cursor-pointer items-center gap-1" onClick={() => setSave(!save)}>
                            <FiHeart strokeWidth={save ? "0" : "1"} fill={save ? "blue" : "none"} /> <p>Save</p>
                        </span>
                    </span>
                </div>
            </section>

            <section>
                Photos
            </section>

            {/* Details */}
            <section className="flex h-70">
                <div className="flex-1 h-fit">
                    {/* OverView */}
                    <div className="flex-col">
                        <p className="my-3"><b>Overview</b></p>
                        <ul className="flex gap-2" >
                            <li><FiHome /></li>
                            <li><b>2bed</b></li>
                            <li><b>4guests</b></li>
                            <li><b>2 private baths</b></li>
                        </ul>
                        <p><b>Free cancellation withing 48 hours</b></p>
                    </div>
                    <div>

                    </div>
                </div>
                <div className="flex-1">Payment info</div>
            </section>
        </div>
    )
}

export default RoomDetails