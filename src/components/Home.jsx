import React from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../config/Config';
import { Outlet, useNavigate } from 'react-router-dom';
import { SiBookstack } from "react-icons/si";
import { FaPenAlt } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Loading from './Loading';

const Home = () => {
    const navigate = useNavigate();

    const logout = () => {
        signOut(auth)
        navigate('/')
    }
    return (
        <div className='w-full h-[100vh] overflow-hidden m-auto relative '
        >
            {/* Header */}
            <header className='w-full border-b-2 h-20 m-auto z-[999] rounded-b-md fixed top-0 left-0 p-4 flex  items-center '>
                <h1 className='text-3xl px-6 bg w-1/4 font-mono text-amber-800 font-semibold'>Y76 Shelves</h1>

                {/* Navigation */}
                <div className='w-3/4 px-5 flex items-center justify-end gap-x-9'>
                    <div
                        onClick={() => { navigate('/home/books') }}
                        className=' flex items-center gap-2 cursor-pointer hover:scale-95 hover:opacity-30 transition duration-200 ease-in-out'>
                        <p className='text-amber-600 font-bold '>Books</p>
                        <SiBookstack size={25} color='#92400e' />
                    </div>

                    <div
                        onClick={() => { navigate('/home/authors') }}
                        className='2 flex items-center gap-2 cursor-pointer hover:scale-95 hover:opacity-30 transition duration-200 ease-in-out'>
                        <p className='text-amber-600 font-bold '>Authors</p>
                        <FaPenAlt size={25} color='#92400e' />
                    </div>

                    <div
                        onClick={logout}
                        className=' flex items-center gap-2 cursor-pointer hover:scale-95 hover:opacity-30 transition duration-200 ease-in-out'>
                        <p className='text-amber-600 font-bold '>Logout</p>
                        <RiLogoutBoxRLine size={25} color='#92400e' />
                    </div>
                </div>
            </header>

            <Loading />
            <Outlet />

        </div>
    )
}

export default Home