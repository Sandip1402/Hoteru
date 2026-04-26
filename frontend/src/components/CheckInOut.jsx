

const CheckInOut = () => {
    return (
        <>
            {/*Check In & check Out - mobile */}
            < div className="md:hidden my-3 flex" >
                <span className="w-1/2">
                    <label htmlFor="checkIn">Check in</label>
                    <input id="checkIn" className="input-field block" type="date" onChange={(ev) => setCheckIn(ev.target.value)} />
                </span>

                <span className="w-1/2">
                    <label htmlFor="checkOut">Check out</label>
                    <input id="checkOut" className="input-field block" type="date" onChange={(ev) => setCheckOut(ev.target.value)} />
                </span>
            </div >

            {/* Check in, Check out*/}
            < div className="hidden md:flex flex-1 md:gap-6 lg:gap-10" >
                <span>
                    <label htmlFor="checkIn">Check in</label>
                    <input id="checkIn" className="input-field block" type="date" onChange={(ev) => setCheckIn(ev.target.value)} />
                </span>

                <span>
                    <label htmlFor="checkOut">Check out</label>
                    <input id="checkOut" className="input-field block" type="date" onChange={(ev) => setCheckOut(ev.target.value)} />
                </span>
            </div>
        </>
    )
}

export default CheckInOut