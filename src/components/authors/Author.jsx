import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from '../../config/Config';
import BookCard from "../books/BookCard";

const Author = () => {
    // onSnapshot: attaches a listener so
    //  that our app will constantly display the real - time data whenever a newdata is added or removed

    const { id } = useParams()
    const [booksData, setBooksData] = useState([]);
    const [authorNameState, setAuthorNameState] = useState('')

    const getBooksByAuthorId = () => {

        const q = query(collection(db, "books"), where("authorId", "==", id));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const books = [];
            const authorDoc = await getDoc(doc(db, 'authors', id));
            const authorData = authorDoc.data();
            const authorName = authorData.author.name;
            querySnapshot.forEach((doc1) => {
                books.push({ ...doc1.data(), id: doc1.id });
            });
            setAuthorNameState(authorName);
            setBooksData(books);
        });

        return unsubscribe;
    };




    useEffect(() => {
        getBooksByAuthorId()
    }, [id])


    return (
        <div className="h-screen w-full mt-32 p-2 rounded-md ">
            <div className="h-full w-[90%] m-auto bg-slate-400 p-2 rounded-md ">
                <h1 className="text-2xl text-center font-semibold w-full truncate text-amber-800 h-fit mb-2">
                    {authorNameState}' Books
                </h1>
                <div className="w-full flex items-center flex-wrap gap-x-2 gap-y-8 p-2 overflow-auto h-[70vh] mb-16 pb-10 rounded-s-md bg-slate-50">
                    {booksData.map((ba) => (
                        <BookCard
                            key={ba.id}
                            id={ba.id}
                            coverImage={ba.coverImage}
                            title={ba.title}
                            brief={ba.brief}
                            publishedDate={ba.publishedDate}
                            published={ba.published}
                            authorName={authorNameState}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Author