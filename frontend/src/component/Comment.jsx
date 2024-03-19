import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {AiOutlineSend} from 'react-icons/ai'
import CommentBox from './CommentBox'

const Comment = ({
    id}
) =>
 {
   
    const [comments,setComments] = useState([])
    const [done,setDone] =useState(true)
    const [content,setContent] = useState("")

   useEffect(()=>{
    axios.get(`/api/v1/comment/total/${id}`)
    .then((item)=>setComments(item?.data?.data))
    .catch((err)=>console.error(err))
   },[comments,done]) 

   const add = async()=>{
    if(content !== "")
    {
        try{

            const response = await axios.post(`/api/v1/comment/addComment/${id}`,{content:content})
            if(response)
            {
                console.log(response)
                setContent("")
                setDone((prev)=>!prev)
            }
            else
            {
                console.error("Error!!")
            }
        }
        catch(err)
        {
            console.error(err)
        }
    
    }
   }
  return (
    <div className='w-[40vw] border-gray-200 border-[1px] shadow-lg shadow-red-500 my-3 '>
    <h1 className=' p-2 flex items-start ml-2  text-xl  font-bold '>Comment</h1>
    <div className='flex'>
    <input type='text ' className=' bg-slate-200  rounded-md w-[30vw] p-1 ml-5 my-3 ' value={content} onChange={(e)=>{setContent(e.target.value)}}/>
    <AiOutlineSend size={25} className=' mt-4 ml-2 cursor-pointer ' onClick={add}/>
    </div>
    {comments.map((post)=>(
                <div key={post._id} className=' p-2'>
                    <CommentBox {...post}/>
                </div>
            ))}
    </div>
  )
}

export default Comment