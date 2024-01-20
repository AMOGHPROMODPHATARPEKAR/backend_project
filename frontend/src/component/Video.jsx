import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Button from './Button'

const Video = () => {

  const { id } = useParams()
  const [video, setVideo] = useState({})
  const [owner, setOwner] = useState({})
  const [subscribed,setSubscribed] = useState(false)
  console.log(id)
  useEffect(() => {
    // axios.get(`api/v1/video/get/${param}`).then((item)=>setVideo(item))
    axios.get(`/api/v1/videos/get/${id}`).then((item) => {
      setVideo(item.data.data[0]),
        setOwner(item.data.data[0].owner[0])
    })
      .catch((err) => console.log(err))


  }, [])

  useEffect(()=>{

    const channelId = owner._id;
      console.log('channel',channelId)
      axios.post('/api/v1/subcription/subOrNot',{channelId})
      .then((item)=> setSubscribed( item.status === 200?true:false))

  },[owner])

  console.log(subscribed)
  const subscribe = async() =>{
    const channelId = owner._id;
    const subscribe = await axios.post('/api/v1/subcription/toggleSubsciption',{channelId});
    // console.log(subscribe.status);
    setSubscribed((prev)=> !prev);
  }
  // console.log(owner)
  return (
    <div className=' mx-auto flex flex-col justify-center items-center'>
      <div className=' mx-auto h-[500px] w-[500px]'>
        {video.videoFile && (
          <video className=' w-full h-full' controls>
            <source src={video.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className=' flex w-full justify-center items-center'>
        <div className=' m-4 p-2'>
          <img src={owner.avatar} alt="owner" srcset="" className=' w-[50px] h-[50px] rounded-full' />
        </div>
        <div className=' mt-4'>
        <h1>{video.title}</h1>
        <p>{video.description}</p>
        </div>
        <div onClick={subscribe}>
        <Button  subscribed={subscribed} bgColor='bg-red-600' className='ml-10 '>Subscriber</Button>
        </div>
      </div>
    </div>
  )
}

export default Video