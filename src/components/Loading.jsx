import React, { useContext } from 'react'
import { Context } from '../context/Context'

const Loading = () => {
    const { loading } = useContext(Context)

    return (
        <>
            {loading &&
                <div className='w-full h-full  opacity-80 fixed z-[9999] bg-slate-200 flex flex-col items-center justify-center'>
                    <div className="loader-wrapper w-12 h-12">
                        <div className="loader animate-spin w-full h-full border-4  border-t-orange-600 border-b-black rounded-full">
                            <div className="loader-inner duration-200 border-b-[red] border-t-pink-300"></div>
                        </div>
                    </div>
                    <h1 className='font-montserrat font-semibold text-orange border-t-orange-600'>One Moment ...</h1>
                </div>
            }
        </>
    )
}

export default Loading