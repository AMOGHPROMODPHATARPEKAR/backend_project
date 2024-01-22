import React,{useState} from 'react'
import Logo from './Logo'
import {useNavigate } from 'react-router-dom'
import Button from './Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

const AddPost = () => {
  const navigate = useNavigate();
  const [error,setError] = useState(null)
  const [form,setForm] =useState({
    title:'',
    description:'',
    videoFile:null,
    thumbnail:null
  })
 
  const handleSuccess = () => {
    
    toast.success('Video uploaded successful!', {
      position: 'top-center',
      autoClose: 3000, // milliseconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }
  const handleError = () => {
    toast.error('Error occurred!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    console.log(form);
    // Update form data based on the input field's type
    setForm((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'videoFile' || name=== 'thumbnail' ? files[0] : value,
    }));
  };

  

   function updateFileName(e) {
    
    handleChange(e);
    
    console.log(e.target.name)
    const fileName = document.getElementById(e.target.name);
    if (e.target.files.length > 0) {
      fileName.textContent = e.target.files[0].name;
    } else {
      fileName.textContent = 'Choose a file';
    }

    // handleChange(e);
  }

  const upload = async(e)=>{

     e.preventDefault();
      try {
        console.log(form);
        const video = await axios.post('/api/v1/videos/videoUpload',form,{
          headers: {
              'Content-Type': 'multipart/form-data',
            },
        });
      console.log(video.status)
      if(video.status === 200)
      {
        handleSuccess()
      }
      else
      {
        handleError()
      }
      // navigate('/')
      } catch (error) {
        setError(error.message);
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
        <ToastContainer/>
        <h2 className="text-center text-2xl font-bold leading-tight">Video Upload</h2>
        <p className="mt-2 text-center text-base text-black/60">
                    Show your creativity to your world
                    
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={upload} className='mt-8'>
        <div className=' space-y-5'>
           
           <div>
            <label className=' w-full inline-block mb-1 py-1'>Title:</label>
            <input  className=' w-full  rounded-lg focus:bg-gray-50 outline-none  mb-1 py-2' type='text' name='title' value={form.title} onChange={handleChange} />
           </div>
           <div>
            <label className=' w-full inline-block mb-1 py-1'>Description:</label>
            <input  className='w-full  rounded-lg focus:bg-gray-50 outline-none  mb-1 py-2' type='text' name='description' value={form.description} onChange={handleChange} />
           </div>

           <div class="relative w-64">
           <label className=' w-full inline-block mb-1 py-1'>Video File:</label>
            <input
              type="file"
              name='videoFile'
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="video/*" 
              onChange={updateFileName}
            />
            <div class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-between">
              <span id='videoFile'>Choose a file</span>
              <svg
                class="w-4 h-4 fill-blue text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 12a2 2 0 100-4 2 2 0 000 4zM10 2a8 8 0 100 16 8 8 0 000-16zm8.8 2.97a9.95 9.95 0 00-1.79-1.78A1 1 0 0016 4H4a1 1 0 00-.97 1.22 9.95 9.95 0 00-1.78 1.78A1 1 0 002 7v11a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-.8-.98z"
                />
              </svg>
            </div>
          </div>
           
           <div class="relative w-64">
           <label className=' w-full inline-block mb-1 py-1'>Thumbnail:</label>
            <input
              type="file"   
              name='thumbnail'
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*" 
              onChange={updateFileName}
            />
            <div class="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-between">
              <span id='thumbnail'>Choose a file</span>
              <svg
                class="w-4 h-4 fill-blue text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 12a2 2 0 100-4 2 2 0 000 4zM10 2a8 8 0 100 16 8 8 0 000-16zm8.8 2.97a9.95 9.95 0 00-1.79-1.78A1 1 0 0016 4H4a1 1 0 00-.97 1.22 9.95 9.95 0 00-1.78 1.78A1 1 0 002 7v11a1 1 0 001 1h16a1 1 0 001-1V7a1 1 0 00-.8-.98z"
                />
              </svg>
            </div>
</div>

           <Button
           type='submit'
           className='w-full'
           >
            Upload
           </Button>
        </div>
        </form>
        </div>
    </div>
  )
}

export default AddPost