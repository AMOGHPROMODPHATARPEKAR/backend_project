import axios from 'axios'
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom'

const Edit = () => {

    const [video,setVideo] = useState({})
    const [title,setTitle] = useState()
    const {id} = useParams()
    // console.log(id)

    useEffect(()=>{

        axios.get(`/api/v1/videos/get/${id}`)
        .then((item)=>setVideo(item.data?.data[0]))
        .catch((err)=> console.log(err))

        setTitle(video.title)

    },[])
    console.log(video)
  return (
    
        <div className=' h-[85vh] w-[60vw] bg-slate-300  border-slate-600 m-auto rounded-md my-8'>
        <div className='pt-5 '>
            <label className=' w-full '>Title</label>
            <input type="text" className='rounded-sm w-[80%] mt-2' value={title} onChange={(e)=>setTitle(e.target.value)} />
        </div>
         
        </div>

  )
}

export default Edit