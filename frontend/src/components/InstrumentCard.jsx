import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const InstrumentCard = ({ instrument }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()

    return (
        <div onClick={()=> {navigate(`/instrument-details/${instrument._id}`); scrollTo(0,0)}} className='group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'>
            <div className='relative h-48 overflow-hidden'>
                <img src={instrument.image} alt="Instrument Image" className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
                {instrument.isAvailable && (
                    <p className='absolute top-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'>Available Now</p>
                )}
                <div className='absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg'>
                    <span className='font-semibold'>{currency}{instrument.pricePerDay}</span>
                    <span className='text-sm text-white/80'> / day</span>
                </div>
            </div>
            <div className='p-4 sm:p-5'>
                <div className='flex justify-between items-start mb-2'>
                    <div>
                        <h3 className='text-lg font-medium'>{instrument.brand} {instrument.model}</h3>
                        <p className='text-muted-foreground text-sm'>{instrument.category}</p>
                    </div>
                </div>
                <div className='mt-4 grid grid-cols-2 gap-y-2 text-green-600'>
                    <div className='flex items-center text-sm text-muted-foreground'>
                        <img src={assets.location_icon} alt="" className='h-4 mr-2' />
                        <span>{instrument.location}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstrumentCard