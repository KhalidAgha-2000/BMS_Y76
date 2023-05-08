import React, { createContext, useState } from 'react'
export const Context = createContext()
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '../config/Config';

export const ContextBody = ({ children }) => {

    // Handle error/message
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Get Author Data
    const [authorsData, setAuthorsData] = useState([])

    const getAllAuthors = async () => {

        const q = query(collection(db, "authors")); const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const authorsData = [];
            querySnapshot.forEach((doc) => {
                const author = { ...doc.data(), id: doc.id }
                authorsData.push(author);
            });
            setAuthorsData(authorsData);
            return () => unsubscribe();
        });
    }

    return (
        <Context.Provider
            value={{
                message, setMessage,
                authorsData, setAuthorsData, getAllAuthors,
                loading, setLoading
            }}
        >
            {children}
        </Context.Provider>
    )
}