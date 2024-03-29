import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {BiEdit} from 'react-icons/bi'

const PostCard = ({
    _id,
    title,
    thumbnail,
    description,
    owner,
    edit=false,
}) => {

    const navigate = useNavigate()
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
                <div className=' cursor-pointer   items-end ml-[100px] mt-3' onClick={()=> navigate(`/edit/${_id}`)}>
                   <BiEdit size={30} fill='green'/>
                </div>
            )}
        </div>
  )
}

export default PostCard