import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const PostCard = ({
    _id,
    title,
    thumbnail,
    description,
    owner
}) => {

    const navigate = useNavigate()

  return (
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4 cursor-pointer' onClick={()=>navigate(`/video/${_id}`)}>
                <img src={thumbnail} alt='thumbnail'
                className='rounded-xl w-[300px] h-[300px]' />
            </div>
            <div className=' flex flex-1 cursor-pointer' >
                <img src={owner?.avatar} alt="user"  className=' rounded-full w-10 h-10'onClick={()=> navigate(`/channel/${owner._id}`)} />
                <div>
            <h2
            className='text-lg font-bold'
            >Title : {title}</h2>
            <p>Description:{description}</p>
            </div>
            </div>
        </div>
  )
}

export default PostCard