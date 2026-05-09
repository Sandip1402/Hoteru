import React, { useState } from 'react'
import { FaChevronLeft, FaPen } from 'react-icons/fa'
import { Link } from 'react-router'
import { RoomCardFlat } from '../components/RoomCardFlat'
import { PriceDetails } from '../components/PaymentForm'

const Payment = () => {

    const[open, setOpen] = useState()


    return (
        <div className='max-md:p-3 md:p-5 lg:px-15 xl:px-20'>
            <Link to='/hotels/roomdetails' className='flex items-center w-max text-gray-500'>
                <FaChevronLeft  size={10} />
                Back
            </Link>

            <h3 className='text-xl my-5 font-bold'>Confirm and Pay</h3>

            <div className='flex max-lg:flex-col max-lg:gap-y-5 lg:justify-between lg:flex-row-reverse'>
                {/* Room Detail */}
                <section className='flex flex-col gap-y-2 rounded-box lg:shadow-lg lg:w-1/2 lg:p-5'>
                    <RoomCardFlat />
                    <PriceDetails />
                </section>

                <section className='lg:flex lg:flex-col lg:gap-y-5 lg:w-9/20'>
                    {/* Trip Details */}
                    <div className='flex flex-col gap-y-2'>
                        <h3 className='text-lg max-lg:mt-2 font-bold'>Your Trip</h3>
                        <div className='flex max-lg:flex-col max-lg:gap-y-2 lg:gap-x-3 
                                        *:flex-1 *:flex-col *:bg-base-300 *:py-2 *:px-3 *:rounded-box 
                                        **:last:flex **:last:justify-between'>
                            <span>
                                <label>Dates</label>
                                <span>
                                    <p className='text-gray-500'>july 17 - 21</p>
                                    <FaPen />
                                </span>
                            </span>
                            <span>
                                <label>Guests</label>
                                <span>
                                    <p className='text-gray-500'>4</p>
                                    <FaPen />
                                </span>
                            </span>

                        </div>
                    </div>

                    {/* Payment options */}
                    <div className='flex flex-col gap-y-2'>
                        <h3 className='text-lg max-lg:mt-2 font-bold'>Pay with</h3>
                        <ul className='flex *:py-2 *:px-3 *:rounded-full *:text-sm *:bg-base-300 gap-5
                                *:hover:bg-primary/80 *:hover:text-white *:cursor-pointer'>
                            <li>Credit Card</li>
                            <li>Paypal</li>
                            <li>Google Pay</li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Payment