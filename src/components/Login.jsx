import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/Config';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('')
    const [newUser, setNewUser] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError(false)
        if (newUser) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    toast.success('You have successfully signed up!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    localStorage.setItem('username', username)
                    setTimeout(() => {
                        navigate('/home/authors');

                    }, 2000);
                })
                .catch((error) => {
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
                })
        }
        else {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    toast.success('You have successfully logged in!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    localStorage.setItem('username', username)
                    setTimeout(() => {
                        navigate('/home/books')

                    }, 2000);
                })
                .catch(() => {
                    toast.error('Invalid Credential !', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                })
        }
    }
    return (
        <div className='login--page w-full h-screen m-auto p-4 bg-slate-200 flex items-center'
        >
            {/* style */}
            <div class="background">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ToastContainer />

            <form
                onSubmit={handleSubmit}
                className="login-form relative w-1/3 p-1 h-fit m-auto flex flex-col items-center rounded-lg pb-4
                  bg-gradient-to-b from-white to-white  
             
                "
            >
                <h1 className='w-full h-fit p-1 mt-4  text-orange-900  text-center font-bold text-3xl'>Y76 Shelves</h1>
                <em className='w-full h-fit my-4 mb-10 text-orange-900  text-center text-lg'>
                    {newUser ?
                        "Create new admin account" : "Log In as Administrator"
                    }
                </em>

                <div className='flex flex-col gap-y-6 w-full m-auto items-center'>
                    {newUser && (
                        <div className='w-[90%] relative'>
                            <label className='absolute -top-3 font-semibold left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Username</label>
                            <input className='bg-slate-100 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-700'
                                onChange={(e) => setUsername(e.target.value)}
                                type="username"
                                id="username"
                                placeholder='agha'
                                required />
                        </div>
                    )}

                    <div className='w-[90%] relative'>
                        <label className='absolute -top-3 font-semibold left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Email</label>
                        <input className='bg-slate-100 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-700'
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            required
                            placeholder='emai@gmail.com'
                        />
                    </div>

                    <div className='w-[90%] relative'>
                        <label className='absolute -top-3 font-semibold left-2 text-white bg-amber-200 w-fit h-fit text-sm p-[2.1px] rounded-md'>Password</label>
                        <input className='bg-slate-100 rounded-md w-full h-12 px-2 outline-none focus:outline-amber-700'
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            placeholder='****'
                            required
                        />
                    </div>

                    <button
                        disabled={email === '' || password === '' || newUser ? username === '' : ''}
                        className='bg-amber-700 focus:bg-amber-900 hover:bg-amber-900 outline-none  transition duration-200 ease-in-out
                        
                        w-[90%] mt-6 text-white 
                        rounded-md px-24 py-2.5 text-sidebar font-alkatra font-bold text-xs tracking-widest uppercase focus:outline-sidebar
                        disabled:cursor-not-allowed disabled:opacity-25'
                        type="submit">{newUser ? "Sign Up" : "Log In"}
                    </button>

                    {newUser ?
                        <span className="user--state text-orange-900 cursor-pointer">Already have an account?
                            <b onClick={() => {
                                setNewUser(false
                                )
                                setError(false)
                            }}> Login</b>
                        </span>
                        :
                        <span className="user--state text-orange-900 cursor-pointer">Don`t have an account?
                            <b onClick={() => {
                                setNewUser(true)
                                setError(false)
                            }}> Signin</b>
                        </span>
                    }
                </div>
            </form>

            {/* Valid Cridentials */}
            <div className='flex flex-col fixed bottom-2 gap-y-1'>
                <span className='rounded-lg bg-amber-200 px-1 py-2 opacity-50'>Email: agha@gmail.com</span>
                <span className='rounded-lg bg-amber-200 px-1 py-2 opacity-50'>Password: 12313</span>

            </div>
        </div>
    )
}

export default Login