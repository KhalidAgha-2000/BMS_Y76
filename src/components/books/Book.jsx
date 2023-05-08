import { getDoc, deleteDoc, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from '../../config/Config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/Config';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import BookCard from "./BookCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Book = () => {
    const { id } = useParams()
    const [bookInfo, setbookInfo] = useState([])
    const { authorsData, setLoading } = useContext(Context)
    const navigate = useNavigate()

    // Get  data of book
    const getBookById = () => {
        const bookRef = doc(db, 'books', id);
        const unsubscribe = onSnapshot(bookRef, async (docSnapshot) => {
            if (docSnapshot.exists()) {
                const book = docSnapshot.data();
                // Fetch author's name
                const authorDoc = await getDoc(doc(db, 'authors', book.authorId));
                const authorData = authorDoc.data();
                const authorName = authorData.author.name;
                const bookData = { ...book, authorName };
                setbookInfo(bookData);
            } else {
            }
        });
        return unsubscribe;
    };

    const [formData, setFormData] = useState({
        title: '',
        brief: '',
        authorId: '',
    });

    const [formImage, setFormImage] = useState(null)
    // Change image
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFormImage(file);
    };

    // Change data
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            setLoading(true)
            // Update book document in Firebase Firestore
            const bookRef = doc(db, 'books', id);
            await updateDoc(bookRef, {
                title: formData.title,
                brief: formData.brief,
                authorId: formData.authorId,
            });

            toast.success('Book info successfully updated !', {
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
        finally { setLoading(false); }
    };
    const handleSubmitImage = async (event) => {
        event.preventDefault();

        try {
            setLoading(true)
            let newImageUrl = bookInfo.coverImage;
            if (formImage) {
                const storageRef = ref(storage, `bookCovers/${id}`);
                await uploadBytes(storageRef, formImage);
                newImageUrl = await getDownloadURL(storageRef);
            }

            // Update book document in Firebase Firestore
            const bookRef = doc(db, "books", id);
            await updateDoc(bookRef, {
                coverImage: newImageUrl,
            });
            toast.success('Book image was successfully uploaded !', {
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
        finally { setLoading(false); }
    };

    // Publishd
    const publishBook = async () => {
        try {
            setLoading(true)
            const bookRef = doc(db, 'books', id);
            await updateDoc(bookRef, {
                published: true,
                publishedDate: serverTimestamp()
            })
            setbookInfo({
                ...bookInfo,
                published: true,
                publishedDate: new Date().getFullYear()
            })
            toast.success('Book was successfully published !', {
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
        finally { setLoading(false); }
    }

    // Delete
    const deleteBook = async (id) => {
        try {
            setLoading(true)
            await deleteDoc(doc(db, 'books', id));
            navigate('/home/books')
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
        }
    }

    useEffect(() => {
        getBookById();
    }, [id]);

    // Assign the book data to formData when bookInfo is fetched
    useEffect(() => {
        setFormData({
            title: bookInfo.title || '',
            brief: bookInfo.brief || '',
            authorId: bookInfo.authorId || '',
        });
        setFormImage(bookInfo.coverImage || null)

    }, [bookInfo]);

    return (
        <div className="mt-32 w-full  px-8  flex py-2 ">
            <ToastContainer />

            {/* View */}
            <div className="h-full w-1/4">

                <BookCard
                    key={formData.id}
                    id={id}
                    coverImage={bookInfo.coverImage}
                    title={formData.title}
                    brief={formData.brief}
                    publishedDate={bookInfo.publishedDate}
                    published={bookInfo.published}
                    authorName={bookInfo.authorName}

                />

            </div>

            <div className="h-full w-3/4 bg-slate-400 p-2 rounded-md ">
                {/* Header */}
                <div className="flex gap-2 items-center">
                    <h1 className="text-2xl font-semibold w-full truncate text-amber-100 h-fit mb-2">
                        {bookInfo.title}
                    </h1>

                    {/* Delete */}
                    <span
                        onClick={() => deleteBook(id)}
                        className="bg-red-600 hover:bg-red-800  text-white text-sm font-medium mx-2 cursor-pointer px-2.5 py-0.5 rounded transition duration-200 ease-in-out">Delete</span>
                    {/* Publish */}
                    <span
                        onClick={publishBook}
                        className={`${bookInfo.published ? "cursor-not-allowed opacity-50" : ""} bg-green-600 hover:bg-green-800 text-white text-sm font-medium mx-2 cursor-pointer px-2.5 py-0.5 rounded transition duration-200 ease-in-out`}>Publish</span>

                </div>

                {/* Forms */}
                <div className="w-full flex items-center bg-slate-50">
                    {/* INFO */}
                    <form className="w-1/2 h-fit py-8 flex flex-col items-center gap-y-10 " onSubmit={handleSubmit}>

                        <div className='w-[90%] relative'>
                            <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Title</label>
                            <input className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                                required type="text" id="title" name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='w-[90%] relative'>
                            <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Brief</label>
                            <input className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                                required id="brief" type="text" name="brief"
                                value={formData.brief}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='w-[90%] relative'>
                            <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Author</label>
                            <select
                                className='bg-slate-200 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-200'
                                id="authorId"
                                name="authorId"
                                value={formData.authorId}
                                onChange={handleChange}
                            >
                                <option value="">Select an author</option>
                                {authorsData.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.author.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="w-2/4 bg-green-600 hover:bg-green-800 transition duration-200 ease-in-out px-2 py-2 m-auto  rounded-md outline-none focus:outline-amber-200 text-white"
                            type="submit">Save changes
                        </button>
                    </form>

                    {/* Image */}
                    <form className="w-1/2 h-full flex flex-col items-center justify-center  gap-y-52" onSubmit={handleSubmitImage}>

                        <div className='w-[90%] relative'>
                            <label className='absolute -top-3 left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Cover</label>
                            <input className='bg-slate-200 rounded-md w-full h-12 px-2 pt-3 outline-none focus:outline-amber-200'
                                type="file"
                                name="coverImage" id="coverImage" onChange={handleImageChange} />
                        </div>
                        <button
                            className="w-2/4 bg-green-600 hover:bg-green-800 transition duration-200 ease-in-out px-2 py-2 m-auto  rounded-md outline-none focus:outline-amber-200 text-white"
                            type="submit">Upload
                        </button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Book