import React, { useEffect, useState } from 'react'
import AddBook from './AddBook'
import { getDoc, deleteDoc, collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from '../../config/Config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../../context/Context';
import { useContext } from 'react';
import BookCard from './BookCard';


const Books = () => {

    const [bookData, setBookData] = useState([])
    const { setLoading } = useContext(Context)

    // Get All books
    const getAllBooks = async () => {
        const unsubscribe = onSnapshot(query(collection(db, 'books')), async (querySnapshot) => {
            const booksData = [];
            for (const doc1 of querySnapshot.docs) {
                const book = { ...doc1.data(), id: doc1.id }
                // Fetch author's name
                const authorDoc = await getDoc(doc(db, 'authors', book.authorId));
                const authorData = authorDoc.data();
                const authorName = authorData.author.name;
                booksData.push({ ...book, authorName });
            }
            setBookData(booksData);
        })
        return unsubscribe;
    }

    // Delete Book
    const deleteBook = async (id) => {
        try {
            setLoading(true)
            // Delete book document from Firebase Firestore
            await deleteDoc(doc(db, 'books', id));

            toast.success('Book was successfully deleted !', {
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
        }
    }

    useEffect(() => {
        getAllBooks()
    }, [])

    return (
        <div className='relative w-full h-full '>

            <ToastContainer />
            <AddBook />

            <div className='flex flex-wrap gap-6 p-2 h-[55vh] overflow-auto justify-center m-auto w-full '>

                {bookData.length == 0 ?
                    <p className='w-fit m-auto p-4 rounded-md h-fit text-center mt-10 text-amber-900 bg-amber-200'>Getting data, Try to add new book or reload the page</p> :
                    bookData.map((b) => (

                        <BookCard
                            key={b.id}
                            id={b.id}
                            coverImage={b.coverImage}
                            title={b.title}
                            brief={b.brief}
                            publishedDate={b.publishedDate}
                            published={b.published}
                            authorName={b.authorName}
                            deleteBook={() => deleteBook(b.id)}

                        />

                    ))}


            </div>
        </div>
    )
}

export default Books