import { createContext, useContext, useState } from "react";

export function useSearch() {
    const [place, setPlace] = useState("");
    const [checkIn, setCheckIn] = useState(Date);
    const [checkOut, setCheckOut] = useState(Date);
    const [guests, setGuests] = useState(null);

    const searchContext = createContext({
        place,
        checkIn,
        checkOut,
        guests,
        setPlace,
        setCheckIn,
        setCheckOut,
        setGuests,
    });
    
    return useContext(searchContext);
}