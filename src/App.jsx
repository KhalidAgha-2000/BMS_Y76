import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/Config.js";
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Books from './components/books/Books.jsx';
import Authors from './components/authors/Authors.jsx';
import Author from './components/authors/Author.jsx';
import { Context } from './context/Context.jsx';
import Book from './components/books/Book.jsx';

function App() {
  // Check if user authenticated
  const [userLoggedin, setUserLoggedin] = useState(false)

  const { getAllAuthors } = useContext(Context)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedin(true)
        getAllAuthors()
      }
      else { setUserLoggedin(false) }
    })
  }, [])


  return (

    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path="/login" element={<Login />} />
          {userLoggedin ?
            <Route path="/home" element={<Home />}>
              <Route path="books" element={<Books />} />
              <Route path="books/:id" element={<Book />} />
              <Route path="authors" element={<Authors />} />
              <Route path="authors/:id" element={<Author />} />
            </Route>
            :
            <Route path="/login" element={<Login />} />
          }
        </Routes>

      </Router>
    </>)
}

export default App
