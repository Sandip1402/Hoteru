import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { fetchApi } from "../util/api";
import { FiHeart, FiStar, FiCircle, FiShare2, FiHome, FiCalendar } from "react-icons/fi";
import { Review } from "../components/RoomCard";
import { PaymentForm } from "../components/PaymentForm";
import { ReviewCard } from "../components/ReviewCard";


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
        <div className="py-1 max-md:px-3 md:px-5 lg:px-20">

            {/* Intro */}
            <section className="my-3 flex flex-col">

                <div className="w-max flex gap-2">
                    <b className="text-lg">Superior Family Room</b>
                    <Review />
                </div>

                <div className="flex justify-between">

                    {/* Place */}
                    <span className="text-gray-500">
                        Taito city, Tokyo, Japan
                    </span>

                    {/*Share & save */}
                    <span className="flex items-center gap-4">
                        {/* fix - give share options */}
                        <span className="flex cursor-pointer items-center gap-1">
                            <FiShare2 /> <p>Share</p>
                        </span>
                        <span className="flex cursor-pointer items-center gap-1" onClick={() => setSave(!save)}>
                            <FiHeart strokeWidth={save ? "0" : "1"} fill={save ? "blue" : "none"} /> <p>Save</p>
                        </span>
                    </span>
                </div>
            </section>

            {/* Photos */}
            <section>
                {/* fix - photos */}
                Photos
            </section>

            <section className="flex justify-between max-lg:flex-col">

                {/* Room Details */}
                <div className="flex-col gap-y-3 flex-2">

                    {/* OverView */}
                    <div className="flex flex-col gap-y-2">
                        <h3><b>Overview</b></h3>
                        <ul className="flex gap-2 items-center" >
                            <li><FiHome className="text-main-color" /></li>
                            <li><b>2bed</b></li>
                            <li><b>4guests</b></li>
                            <li><b>2 private baths</b></li>
                        </ul>
                        <span className="flex gap-2 items-center">
                            <FiCalendar className="text-pink-600" />
                            <b>Free cancellation withing 48 hours</b>
                        </span>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum sint aperiam ducimus odio
                            explicabo facere dignissimos magnam? Ullam consectetur eligendi asperiores at animi
                            repellendus optio, sed, sit numquam enim quas.
                        </p>
                    </div>

                    <div className="w-full h-0.5 my-5 border-b-1 border-b-gray-400"></div>

                    {/* Offerings */}
                    <div className="flex flex-col gap-y-2">
                        <h3><b>This Place Offers</b></h3>
                        <ul className="flex flex-wrap *:w-1/2 ">
                            {/*fix - need to add icons */}
                            <li>Kitchen</li>
                            <li>TV</li>
                            <li>Air Conditioning</li>
                            <li>WiFi</li>
                            <li>Heating</li>
                            <li>First Aid Kit</li>
                            <li>Free Hot Beverages</li>
                            <li>Bicycle rental</li>
                        </ul>
                    </div>
                </div>

                <div className="lg:hidden w-full h-0.5 mt-5 border-b-1 border-b-gray-400"></div>

                {/* Payment info */}
                <div className="flex-1 lg:flex lg:justify-end">
                    <PaymentForm />
                </div>
            </section>
            
            <div className="w-full h-0.5 my-5 border-b-1 border-b-gray-400"></div>

            {/* Reviews */}
            <section className="mb-3">
                <Review style={"my-3"} />
                <div className="w-full flex gap-y-5 max-sm:flex-col sm:flex-wrap sm:justify-between xl:gap-1">
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                    <ReviewCard />
                </div>
            </section>
            
        </div>
    )
}

export default RoomDetails