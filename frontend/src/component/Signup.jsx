import React ,{useState} from 'react'
import { useForm } from 'react-hook-form'
import Input from './Input'
import Button from './Button'
import axios from 'axios'

const Signup = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullname:'',
        password:'',
        avatar:null,
      });

      const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: name === 'avatar' ? files[0] : value,
        }));
      };
    


   const handleSubmit = async (e) =>{

    e.preventDefault();

    try {
      const response = await axios.post('api/v1/users/register',formData,{
        headers: {
            'Content-Type': 'multipart/form-data',
          },
      });
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }

   }

    return (

        <div className=' flex items-center justify-center' >

            <form onSubmit={handleSubmit}>
                <div className='space-y-5 '>
            <label className=' w-full  inline-block mb-1 pl-1'>User Name:</label>
      <input className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full' type="text" name="username" value={formData.name} onChange={handleChange} />

      <label className='w-full  inline-block mb-1 pl-1'>Email:</label>
      <input className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full' type="email" name="email" value={formData.email} onChange={handleChange} />

      <label className='w-full  inline-block mb-1 pl-1'>FullName:</label>
      <input className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full' type="text" name="fullname" value={formData.fullname} onChange={handleChange} />

      <label className='w-full  inline-block mb-1 pl-1'>Password:</label>
      <input className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full' type="password" name="password" value={formData.password} onChange={handleChange} />

      <label className='w-full  inline-block mb-1 pl-1'>Avatar:</label>
      <input className='px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full' type="file" name="avatar"  onChange={handleChange} />

     

      <button className=' w-1/4 bg-blue-600 rounded-lg cursor-pointer'  type="submit">Submit</button>
      </div>
            </form>
        </div>

    )
}

export default Signup