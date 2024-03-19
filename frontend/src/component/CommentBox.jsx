import React from 'react'
import {BsThreeDotsVertical} from 'react-icons/bs'

const CommentBox = ({ content, owner }) => {
    return (
      <div className="flex items-start border-red-500 border-[1.2px] rounded-sm p-2">
        <img src={owner?.avatar} alt="Avatar" className="h-10 w-10 rounded-full mx-5" />
        <div>
          <p className="font-bold">@{owner?.fullname}</p>
          <p>{content}</p>
        </div>
        
        <BsThreeDotsVertical className='ml-auto'  />

      </div>
    );
  }
  

export default CommentBox