import { useState } from "react";
import { FiHeart } from "react-icons/fi";


export const RoomCardFlat = ({ booking }) => {

    const [save, setSave] = useState(false);


    if (!booking) {
        return null;
    }


    return (

        <div className="
            max-sm:flex
            rounded-2xl
        ">

            {/* Image */}
            <span className="
                cursor-pointer
                max-sm:w-1/2
                sm:w-50
                sm:flex
                sm:flex-col
            ">

                <img
                    src={
                        booking.thumbnailUrl ||
                        "/room1.jpg"
                    }
                    alt={booking.roomName}
                    className="
                        rounded-2xl
                        object-cover
                        w-full
                        sm:h-4/5
                    "
                />


                {/* Desktop */}
                <section className="
                    max-sm:hidden
                    flex
                    flex-col
                    text-xs
                    p-1
                    gap-y-1
                ">

                    <div className="
                        flex
                        justify-between
                    ">

                        <div>

                            <p className="font-semibold">
                                {booking.roomName}
                            </p>

                            <p className="
                                text-gray-500
                            ">
                                {booking.listingName}
                            </p>

                        </div>

                    </div>


                    <div className="
                        flex
                        justify-between
                        items-center
                    ">

                        <p className="
                            text-gray-500
                        ">
                            Room price
                        </p>

                        <span>
                            ₹{booking.pricePerNight}/night
                        </span>

                    </div>

                </section>

            </span>


            {/* Mobile */}
            <div className="
                sm:hidden
                px-2
                flex
                flex-col
                justify-between
                flex-1
            ">

                <section className="
                    flex
                    flex-col
                ">

                    <span className="
                        flex
                        items-center
                        justify-between
                    ">

                        <p className="
                            text-gray-500
                        ">
                            {booking.listingName}
                        </p>


                        <span
                            className="cursor-pointer"
                            onClick={() =>
                                setSave(!save)
                            }
                        >

                            <FiHeart
                                strokeWidth={
                                    save ? "0" : "1"
                                }
                                fill={
                                    save
                                        ? "blue"
                                        : "none"
                                }
                            />

                        </span>

                    </span>


                    <p className="font-semibold">
                        {booking.roomName}
                    </p>

                </section>


                <div className="
                    w-30
                    h-0.5
                    border-b-1
                    border-b-gray-400
                " />


                <section className="
                    flex
                    justify-between
                    text-sm
                ">

                    <p className="
                        text-gray-500
                    ">
                        ₹{booking.pricePerNight}/night
                    </p>

                    <p>
                        {booking.guests}{" "}
                        {booking.guests === 1
                            ? "guest"
                            : "guests"}
                    </p>

                </section>

            </div>

        </div>
    );
};