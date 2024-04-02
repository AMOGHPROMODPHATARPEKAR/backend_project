import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {BiEdit} from 'react-icons/bi'
import {MdPublic} from 'react-icons/md'
import {RiGitRepositoryPrivateLine} from 'react-icons/ri'
import {AiOutlineDelete} from 'react-icons/ai'
import axios from 'axios'

const PostCard = ({
    _id,
    title,
    thumbnail,
    description,
    owner,
    isPublish,
    edit=false,
}) => {
    
    const navigate = useNavigate()
    const [publish,setPublish] =useState(isPublish)

    const toggle = async()=>{
        try {
            const response = await axios.patch(`/api/v1/videos/togglePublish/${_id}`)
            if(response){
                console.log("Changed the publish status")
                setPublish((prev)=>!prev)
            }
            else
            {
                console.error("Error while toggle publish")
            }
        } catch (error) {
            console.error(error)
        }
       
    }

    const handleDelete = async()=>{

        try {
            
            const res = await axios.post(`/api/v1/videos/deleteVideo/${_id}`)
            if (res?.data?.success) {
                console.log("res", res.data);
                navigate('/')
              }

        } catch (err) {
            console.log(err.response);
        }

    }

  return (
        <div className='w-full bg-gray-100 rounded-xl p-4'>
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
            {edit && (
                <div className=' flex flex-1 justify-around   mt-3' >
                   <BiEdit size={30} fill='green' className=' cursor-pointer' onClick={()=> navigate(`/profile/updateVideo/${_id}`)}/>
                <div className=' cursor-pointer' onClick={toggle}>
                {publish ? <MdPublic size={30}/> :<RiGitRepositoryPrivateLine size={30}/> }
                </div>
                <AiOutlineDelete size={30} fill='red' className=' cursor-pointer' onClick={handleDelete}/>
                </div>
            )}
        </div>
  )
}

export default PostCard