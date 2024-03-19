import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from './Button'
import {GrView} from "react-icons/gr"
import {AiFillLike} from 'react-icons/ai'
import {BsArrowUpShort} from 'react-icons/bs'
import {BsArrowDown} from 'react-icons/bs'
import Comment from './Comment'
const Video = () => {

  const { id } = useParams()
  const [video, setVideo] = useState({})
  const [owner, setOwner] = useState({})
  const [subscribed,setSubscribed] = useState(false)
  const [like,setLike] = useState(0)
  const [liked,setLiked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate()

  // console.log(id)
  useEffect(() => {

    axios.patch(`/../api/v1/videos/addHistory/${id}`).then((item)=> console.log(item) )
      .catch((err)=>console.log(err))

      axios.patch(`/../api/v1/videos/addView/${id}`)
      .then((item)=> console.log(item))
      .catch((err)=>console.log(err))

      setLike(0);

    // axios.get(`api/v1/video/get/${param}`).then((item)=>setVideo(item))
    axios.get(`/api/v1/videos/get/${id}`).then((item) => {
      setVideo(item.data.data[0]),
        setOwner(item.data.data[0].owner[0])
    })
      .catch((err) => console.log(err))

      axios.get(`/../api/v1/like/videoLiked/${id}`).then((item)=>{
        setLiked(item.data.data)
      })
      
  }, [])

  useEffect(()=>{

    const channelId = owner._id;
      console.log('channel',channelId)
      axios.post('/api/v1/subcription/subOrNot',{channelId})
      .then((item)=> setSubscribed( item.status === 200?true:false))

  },[owner])

  useEffect(()=>{
    axios.get(`/../api/v1/like/videoLikes/${id}`).then((item)=>setLike(item.data.data))
    .catch((err)=> console.log(err))
  },[like,liked])


  // console.log(subscribed)
  const subscribe = async() =>{
    const channelId = owner._id;
    const subscribe = await axios.post('/api/v1/subcription/toggleSubsciption',{channelId});
    // console.log(subscribe.status);
    setSubscribed((prev)=> !prev);
  }

  const toggleLike = async() =>{
      const item = await axios.post(`/api/v1/like/toggleVideoLike/${id}`)
      setLiked((prev)=> !prev)
  }

  // console.log(video)
  return (
    <div className=' mx-auto flex flex-col justify-center items-center'>
      <div className=' mx-auto h-[500px] w-[500px] border-gray-500 border-solid border-2 shadow-md shadow-red-700 my-5'>
        {video.videoFile && (
          <video className=' w-full h-full' controls autoPlay>
            <source src={video.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    
      <div className=' flex w-full justify-center items-center'>
        
        <div className=' mt-4'>
        <h1 className=' text-2xl'>{video.title}</h1>
        
        </div>
        </div>

        <div className=' flex my-3 gap-3 justify-center items-center'>
        <div className='p-2'>
          <img src={owner.avatar} alt="owner" srcset="" className=' w-[50px] h-[50px] rounded-full cursor-pointer' onClick={()=> navigate(`/channel/${owner._id}`)} />
        </div>
        <div onClick={subscribe} className=' p-2'>
        <Button  subscribed={subscribed} bgColor='bg-red-600' className=' p-2 hover:translate-y-[1px]'>Subscriber</Button>
        </div>

        <div className=' border-gray-400 bg-slate-200 rounded-lg px-2 py-1 flex gap-2 items-center cursor-pointer hover:bg-slate-300' onClick={toggleLike}>
         <AiFillLike size={20} fill={`${liked ? 'red': 'gray'}`} /> 
         {like}
        </div>
        </div>

        <div className='border border-gray-600 p-2 my-4'>
      <div  className=" flex  justify-center items-center text-md w-[40vw] cursor-pointer" onClick={()=>setIsExpanded((prev)=>!prev)}>

      {isExpanded ? "Less " : "More "} {isExpanded ?<BsArrowUpShort size={20} /> : <BsArrowDown/>} 

      </div>
      {isExpanded && (
        <div className="xp-4 mt-2">
          <div className=' flex justify-start mt-1 gap-2 '>
          Views:
          <p className=' px-2'>{video.views}</p>
          <GrView size={24} className=' text-gray-200'/>
          <p> {video.createdAt.substring(0, 10)}</p> 
          </div>

          <p className='flex justify-start mt-1'>Description: {video.description}</p>

        </div>
      )}
    </div>

    <Comment id={id}/>    
      
    </div>
    
  )
}

export default Video