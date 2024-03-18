import React ,{useState} from 'react'
import Button from './Button'
import axios from 'axios'
import { NavLink,Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Logo from './Logo'

const Signup = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullname:'',
        password:'',
        avatar:null,
      });

      const handleChange = (e) => {
        const { name, value, files } = e.target;
        console.log(formData)
        setFormData((prevData) => ({
          ...prevData,
          [name]: name === 'avatar' || name === "coverImage" ? files[0] : value,
        }));
      };
    


   const handleSubmit = async (e) =>{

    e.preventDefault();

    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'User Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full Name is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    if (formData.avatar === null) {
      newErrors.avatar = 'Avatar is required';
    }
    console.log(Object.keys(newErrors).length)
    // If there are errors, update the state and stop the submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Continue with form submission logic here

    // Reset errors
    setErrors({});

    try {
      const response = await axios.post('api/v1/users/register',formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },
      })
      if(response)
      {
        navigate('/login')
      }
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }

   }

    return (

        <div className=' flex items-center justify-center' >
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

            <form onSubmit={handleSubmit}>
                <div className='space-y-5 '>
            <label className=' w-full  inline-block mb-1 pl-1 '>User Name:</label>
      <input className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${errors.username? 'border-red-600' : 'border-gray-400'}`} type="text" name="username" value={formData.name}  onChange={handleChange} />
      {errors.username && <div className=" text-red-500 text-left  text-sm">{errors.username}</div>}
      
      
      <label className='w-full  inline-block mb-1 pl-1'>Email:</label>
      <input className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${errors.email? 'border-red-600' : 'border-gray-400'}`} type="email" name="email" value={formData.email}  onChange={handleChange} />
      {errors.email && <div className=" text-red-500 text-left  text-sm">{errors.email}</div>}
      
      <label className='w-full  inline-block mb-1 pl-1'>FullName:</label>
      <input className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${errors.fullname? 'border-red-600' : 'border-gray-400'}`} type="text" name="fullname" value={formData.fullname}  onChange={handleChange} />
      {errors.fullname && <div className=" text-red-500 text-left  text-sm">{errors.fullname}</div>}
      
      <label className='w-full  inline-block mb-1 pl-1'>Password:</label>
      <input className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${errors.password? 'border-red-600' : 'border-gray-400'}`} type="password" name="password" value={formData.password}  onChange={handleChange} />
      {errors.password && <div className=" text-red-500 text-left  text-sm">{errors.password}</div>}
      
      <label className='w-full  inline-block mb-1 pl-1'>Avatar:</label>
      <input className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${errors.avatar? 'border-red-600' : 'border-gray-400'}`} type="file" name="avatar"  onChange={handleChange} />
      {errors.avatar && <div className=" text-red-500 text-left  text-sm">{errors.avatar}</div>}
      
      <label 
      className='w-full  inline-block mb-1 pl-1'>Cover Image:</label>
      <input className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full' type="file" name="coverImage"   onChange={handleChange} />

     

      <Button className=' w-1/4 bg-blue-600 rounded-lg cursor-pointer'  type="submit">Submit</Button>
      </div>
            </form>
            </div>
        </div>

    )
}

export default Signup