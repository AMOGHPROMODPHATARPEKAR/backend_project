import React ,{useState} from 'react'
import { Link ,useNavigate } from 'react-router-dom'
import {Button , Input,Logo} from './index'
import { useDispatch } from 'react-redux'
import {useForm} from 'react-hook-form'
import { login as authLogin} from '../store/authSlice'
import axios from 'axios'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error,setError] =useState('')
  const [form,setForm] =useState({
    email:'',
    password:''
  })
//   const {register,handleSubmit} = useForm()

  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value });
  }

    const login = async(e) =>{
        e.preventDefault();

        try {
            
            const userData = await axios.post('api/v1/users/login',form)
            // console.log(userData.data?.data?.user)
            if(userData)
            {
                // console.log(userData.data?.data?.user)
                // const user = await axios.get('api/v1/users/getUser')
                // console.log(user)
                dispatch(authLogin(userData.data?.data?.user))
                navigate('/')
            }

        } catch (error) {
            setError(error)
        }

    }
  
  return (
    <div className='flex items-center justify-center w-full'>
      <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={login} className='mt-8'>
        <div className=' space-y-5'>
           
           <div>
            <label className=' w-full inline-block mb-1 py-1'>Email:</label>
            <input  className=' w-full  rounded-lg focus:bg-gray-50 outline-none  mb-1 py-2' type='email' name='email' value={form.email} onChange={handleChange} />
           </div>
           <div>
            <label className=' w-full inline-block mb-1 py-1'>Password:</label>
            <input  className='w-full  rounded-lg focus:bg-gray-50 outline-none  mb-1 py-2' type='password' name='password' value={form.password} onChange={handleChange} />
           </div>
           
           <Button
           type='submit'
           className='w-full'
           >
            Sign In
           </Button>
        </div>
        </form>
        </div>
    </div>
  )
}

export default Login