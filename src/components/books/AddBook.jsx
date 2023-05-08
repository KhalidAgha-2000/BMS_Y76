import React, { useContext, useState } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/Config';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../config/Config';
import { Context } from '../../context/Context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddBook = () => {

    const [title, setTitle] = useState('');
    const [brief, setBrief] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [coverImage, setCoverImage] = useState(null);

    const { authorsData, setLoading } = useContext(Context)

    // Add new book
    const handleBookSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true)
            // Upload cover image to storage
            const storageRef = ref(storage, `bookCovers/${coverImage.name}`);
            await uploadBytes(storageRef, coverImage);

            // Get cover image URL from storage
            const imageUrl = await getDownloadURL(storageRef);

            // Create the book object
            const book = { title, brief, authorId, published: false, coverImage: imageUrl }

            const docRef = await addDoc(collection(db, 'books'), book);
            toast.success('New Book was successfully Added !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
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
                theme: "light",
            });
        }
        finally {
            setLoading(false);
            setTitle('');
            setBrief('');
            setCoverImage('');
            setAuthorId('')
        }
    };

    return (

        <div
            className='w-full h-fit flex flex-col items-center gap-y-1 my-2 mt-24 p-1 m-auto bg-slate-50'
        >
            <ToastContainer />

            <h1 className='font-semibold font-mono text-amber-600 text-2xl'>Add New Book</h1>

            <form
                className='flex gap-x-2 w-[90%] h-fit p-4 m-auto '
                onSubmit={handleBookSubmit}
            >

                <div className='w-1/4 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-xs p-[2.1px] rounded-md'>Title</label>
                    <input className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                        required type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className='w-1/4 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-xs p-[2.1px] rounded-md'>Brief</label>
                    <input className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                        required type="text" placeholder="Brief" value={brief} onChange={(e) => setBrief(e.target.value)}
                    />
                </div>

                <div className='w-1/4 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-xs p-[2.1px] rounded-md'>Author</label>
                    <select
                        className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                        value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
                        <option value="">Select author</option>
                        {authorsData.map((author) => (
                            <option key={author.id} value={author.id}>
                                {author.author.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='w-1/4 relative'>
                    <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-xs p-[2.1px] rounded-md'>Cover</label>
                    <input className='bg-slate-200 rounded-md w-full h-12 px-2 pt-3 outline-none focus:outline-amber-200'
                        required type="file" onChange={(e) => setCoverImage(e.target.files[0])}
                    />
                </div>

                <button
                    className='bg-green-400  transition duration-200 ease-in-out focus:bg-green-600  hover:bg-green-600
                    w-fit h-12 px-4 rounded-md outline-none focus:outline-amber-200 text-white' type="submit"
                >
                    Done
                </button>

            </form>

        </div>
    )
}

export default AddBook