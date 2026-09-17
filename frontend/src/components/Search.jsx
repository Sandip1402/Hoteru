import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router";

import { FaSearch } from "react-icons/fa";
import { DateInput } from "./DateInput.jsx";

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [place, setPlace] = useState(searchParams.get("city") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");
  
  const handleSubmit = (ev) => {
    ev.preventDefault();

    const nextParams = {};
    if (place) nextParams.city = place;
    if (checkIn) nextParams.checkIn = checkIn;
    if (checkOut) nextParams.checkOut = checkOut;
    if (guests) nextParams.guests = guests;

    // Check if user is currently on the accommodations route
    if (location.pathname.startsWith("/accommodations")) {
      // Update parameters in place without changing the page
      setSearchParams(nextParams);
    } else {
      // Redirect from landing page straight to the accommodations search route
      const queryString = new URLSearchParams(nextParams).toString();
      navigate(`/accommodations?${queryString}`);
    }
  };


  return (
    <form
      onSubmit={(ev) => handleSubmit(ev)}
      className="
        mx-auto w-full
        rounded-2xl border border-border
        bg-white p-4
        shadow-lg

        sm:flex sm:items-center
        sm:rounded-full sm:p-1.5
      "
    >
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center">

        {/* Location */}
        <div className="min-w-0 px-1 py-2 sm:flex-[1.3] sm:px-5 sm:py-1">
          <label
            htmlFor="place"
            className="block text-xs font-semibold text-text"
          >
            Location
          </label>

          <input
            id="place"
            name="place"
            type="text"
            value={place || ""}
            placeholder="Where are you going?"
            className="
              mt-1 w-full min-w-0
              border-0 bg-transparent p-0
              text-sm text-text
              placeholder:text-text-light
              focus:outline-none
            "
            onChange={(ev) => setPlace(ev.target.value)}
            required
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border sm:h-8 sm:w-px sm:border-t-0" />

        {/* Check in */}
        <DateInput
          id="checkIn"
          name="Check in"
          value={checkIn}
          setDate={setCheckIn}
          style="min-w-0 px-1 py-2 sm:flex-1 sm:px-5 sm:py-1"
        />

        {/* Divider */}
        <div className="border-t border-border sm:h-8 sm:w-px sm:border-t-0" />

        {/* Check out */}
        <DateInput
          id="checkOut"
          name="Check out"
          value={checkOut}
          setDate={setCheckOut}
          style="min-w-0 px-1 py-2 sm:flex-1 sm:px-5 sm:py-1"
        />

        {/* Divider */}
        <div className="border-t border-border sm:h-8 sm:w-px sm:border-t-0" />

        {/* Guests */}
        <div className="min-w-0 px-1 py-2 sm:flex-1 sm:px-5 sm:py-1">
          <label
            htmlFor="guests"
            className="block text-xs font-semibold text-text"
          >
            Guests
          </label>

          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={10}
            value={guests || ""}
            placeholder="Add guests"
            className="
              mt-1 w-full min-w-0
              border-0 bg-transparent p-0
              text-sm text-text
              placeholder:text-text-light
              focus:outline-none
            "
            onChange={(ev) => setGuests(ev.target.value)}
          />
        </div>
      </div>

      {/* Search button */}
      <button
        type="submit"
        aria-label="Search"
        className="
          mt-3 flex h-11 w-full
          items-center justify-center gap-2
          rounded-xl
          bg-primary text-sm font-semibold text-white
          transition hover:bg-primary-dark

          sm:mt-0 sm:h-12 sm:w-12
          sm:shrink-0 sm:rounded-full
        "
      >
        <FaSearch className="text-sm" />
        <span className="sm:hidden">Search</span>
      </button>
    </form>
  );
};