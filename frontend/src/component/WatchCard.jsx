import React from 'react'
import { useNavigate } from 'react-router-dom'
import {AiTwotoneDelete} from 'react-icons/ai'
import axios from 'axios'
 
const WatchCard = ({
    _id,
    title,
    thumbnail,
    description,
    owner,
}) => {

    const del = async()=>{
        const response = await axios.patch(`/api/v1/videos/deleteHistory/${_id}`)
        if(response)
        {
            console.log("Deleted successfully")
        }
        else
        {
            console.error("Error !!")
        }
    }

  return (
    <div className='w-full bg-gray-200 rounded-md p-4'>
            <div className='w-full justify-center mb-4 cursor-pointer' onClick={()=>navigate(`/video/${_id}`)}>
                <img src={thumbnail} alt='thumbnail'
                className='rounded-xl w-[200px] h-[200px] mx-auto' />
            </div>
            <div className=' flex flex-1 cursor-pointer' >
                <img src={owner?.avatar} alt="user"  className=' rounded-full w-10 h-10'onClick={()=> navigate(`/channel/${owner._id}`)} />
                <div>
            <h2
            className='text-lg font-bold ml-2'
            > {title}</h2>
            </div>
            </div>
            <AiTwotoneDelete fill='red' size={20} className=' relative  ml-auto cursor-pointer hover:translate-y-1 transition-transform duration-300 ease-in-out ' onClick={del}/>
        </div>
  )
}

export default WatchCard