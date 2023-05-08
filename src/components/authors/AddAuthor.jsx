import React, { useContext, useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../config/Config';
import { Context } from '../../context/Context'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddAuthor() {
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [bio, setBio] = useState('');
    const { setLoading } = useContext(Context)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const author = { name, birthDate, bio };

        try {
            setLoading(true)
            const docRef = await addDoc(collection(db, "authors"), {
                author: author,
            })
            toast.success('New Author was successfully Added !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            toast.error(`${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        finally {
            setLoading(false);
            setName('');
            setBirthDate('');
            setBio('');
        }

    }

    return (
        <div
            className='w-full h-fit flex flex-col items-center gap-y-1 my-2 mt-24 p-1 m-auto bg-slate-50'
        >
            <ToastContainer />

            <h1 className='font-semibold font-mono text-amber-600 text-2xl'>Add New Author</h1>

            <form
                className='flex gap-x-2 w-[90%] h-fit p-4 m-auto '
                onSubmit={handleSubmit}>

                <div className='w-1/3 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-xs p-[2.1px] rounded-md'>Name</label>
                    <input className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                        required type="text" placeholder="Sylphie Darrow" value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className='w-1/3 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-xs p-[2.1px] rounded-md'>Date Of Birth</label>
                    <input
                        className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                        required type="date"
                        value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                        min="1950-01-01" max="2003-12-31"
                    />
                </div>

                <div className='w-1/3 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Bio</label>
                    <textarea
                        className='bg-slate-200 rounded-md w-full h-12 px-2 pt-3 resize-none outline-none focus:outline-amber-200'
                        required placeholder="Sylphie is a fantasy author ...."
                        value={bio} onChange={(e) => setBio(e.target.value)}
                    >
                    </textarea>
                </div>

                <button
                    className='bg-green-400  transition duration-200 ease-in-out focus:bg-green-600  hover:bg-green-600
                    w-fit h-12 px-4 rounded-md outline-none focus:outline-amber-200  text-white' type="submit"
                >
                    Done
                </button>

            </form>


        </div>
    );
}

export default AddAuthor;
