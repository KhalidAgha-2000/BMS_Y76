import React, { useContext, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore";
import { db } from '../../config/Config';
import AddAuthor from './AddAuthor';
import { Context } from '../../context/Context';
import { AiOutlineSave, AiOutlineUserDelete } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { SiBookstack } from 'react-icons/si';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Authors = () => {
    const { authorsData } = useContext(Context)
    const [name, setName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [bio, setBio] = useState('')
    const { setLoading } = useContext(Context)

    // Update author information
    const handleSubmit = async (e, id) => {
        e.preventDefault();

        const docRef = doc(db, "authors", id);
        const docSnap = await getDoc(docRef);

        const newName = name === '' ? docSnap.data().author.name : name;
        const newBirthDate = birthDate === '' ? docSnap.data().author.birthDate : birthDate;
        const newBio = bio === '' ? docSnap.data().author.bio : bio;

        try {
            setLoading(true)
            await updateDoc(docRef, {
                author: { name: newName, birthDate: newBirthDate, bio: newBio }
            });

            toast.success('Author information was successfully updated !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        } catch (error) {
            toast.error('Something went wrong !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
        finally { setLoading(false) }
    };

    // Delete author and associated books
    const deleteAuthor = async (e, id) => {
        e.preventDefault();
        const authorRef = doc(db, 'authors', id);
        const booksRef = collection(db, 'books');
        const booksQuery = query(booksRef, where('authorId', '==', id));
        const batch = writeBatch(db);

        try {
            setLoading(true)
            // Delete author
            batch.delete(authorRef);

            // Delete associated books
            const booksQuerySnapshot = await getDocs(booksQuery);
            booksQuerySnapshot.forEach((doc2) => {
                const bookRef = doc(booksRef, doc2.id);
                batch.delete(bookRef);
            });

            // Commit the batch
            await batch.commit();
            toast.success('Author successfully deleted !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });

        } catch (error) {
            toast.error(`${error}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
            });
        }
        finally { setLoading(false) }
    }

    return (
        <div className='h-screen'>
            <ToastContainer />
            <AddAuthor />

            <div className='w-4/5 h-auto m-auto'>
                <header className='w-full h-14 p-1 bg-slate-300 rounded-t-lg text-white font-bold text-lg flex justify-around items-center'>
                    <p className='w-1/4 text-center ml-8'>Name</p>
                    <p className='w-1/4 text-center ml-2'>Date Of birth</p>
                    <p className='w-1/4 text-center mr-10 '>Bio</p>
                    <p></p>
                    <p></p>
                </header>

                <form className='h-[45vh]  overflow-auto mb-[140px]'>

                    {authorsData.length == 0 ?
                        <p className='w-fit m-auto p-4 rounded-md h-fit text-center mt-10 text-amber-900 bg-amber-200'>Getting data, Try to add new author or reload the page</p> :
                        authorsData.map((a) => (
                            <div key={a.id}
                                className=' w-full h-14 p-1 bg-slate-50 border-b-2 py-10 flex justify-around items-center'
                            >
                                {/* Books Of Author */}
                                <Link to={`/home/authors/${a.id}`} >
                                    <SiBookstack color='brown' size={20}
                                        className='hover:scale-95 hover:opacity-30 transition duration-200 ease-in-out'
                                    />
                                </Link>

                                <input
                                    type="text"
                                    id='name'
                                    name='name'
                                    required
                                    defaultValue={a.author.name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-1/4 h-8 bg-slate-200 text-amber-400 rounded-md text-center text-lg font-bold outline-none focus:outline-amber-400"
                                />
                                <input
                                    type="date"
                                    id='birthDate'
                                    name='birthDate'
                                    required
                                    defaultValue={a.author.birthDate}
                                    onChange={(e) => { setBirthDate(e.target.value) }}
                                    className="w-1/4 h-8 bg-slate-200 text-amber-400 rounded-md text-center text-lg font-bold outline-none focus:outline-amber-400"
                                    min="1940-01-01"
                                    max="2010-12-31"
                                />
                                <input
                                    type="text"
                                    id='bio'
                                    name='bio'
                                    required
                                    defaultValue={a.author.bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-1/4 h-8 bg-slate-200 text-amber-400 rounded-md text-center text-lg font-bold outline-none focus:outline-amber-400"
                                />
                                {/* Edit */}
                                <span onClick={(e) => { handleSubmit(e, a.id) }}>
                                    <AiOutlineSave
                                        color='green' size={20} cursor='pointer'
                                        className='hover:scale-95 hover:opacity-30 transition duration-200 ease-in-out'
                                    />
                                </span>
                                {/* Delete */}
                                <span onClick={(e) => { deleteAuthor(e, a.id) }}>
                                    <AiOutlineUserDelete
                                        color='red' size={20} cursor='pointer'
                                        className='hover:scale-95 hover:opacity-30 transition duration-200 ease-in-out'
                                    />
                                </span>
                            </div>
                        ))}

                </form>
            </div>

        </div>
    )
}

export default Authors