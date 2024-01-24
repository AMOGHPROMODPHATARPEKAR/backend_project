import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Container , PostCard } from '../component'
import { useParams } from 'react-router-dom'

const ChannelProfile = () => {

  const {id} = useParams()
  // console.log("id ",id);
  const [userData,setUser]= useState({})
  const [posts,setPosts] = useState([])
  const [subscribed,setSubscribed] = useState(false)

  useEffect(()=>{

    axios.get(`/../api/v1/users/c/${id}`)
    .then((item)=>{
      setUser(item.data.data)
      item.data.data.isSubscribed ? setSubscribed(true) : setSubscribed(false)
    })
    .catch((err)=>console.error(err))


    const queryParams = {
      userId: `${id}`,
      page: '1',
    };



    axios.get('/api/v1/videos/getAllVideo',{params:queryParams})
    .then((item)=>setPosts(item.data.data))
    .catch((err)=>console.error(err))

  },[subscribed])

  const subscribe = async() =>{
    const channelId = userData._id;
    const subscribe = await axios.post('/api/v1/subcription/toggleSubsciption',{channelId});
    // console.log(subscribe.status);
    setSubscribed((prev)=> !prev);
  }

  return (
    <div>
        <div className=' w-[90vw]  mx-5 p-4 '>

<div className='w-full  overflow-hidden '>
    <img src={userData.coverImage} alt="banner" className=' w-full block h-[200px] ' />
</div>

<div className=' w-full  flex'>
    <div className='p-3'>
        <img src={userData.avatar} alt="owner" className=' w-[200px] h-[200px] rounded-full' />
    </div>

    <div className=' ml-6  items-start'>
        <p className=' text-3xl mt-5 text-start'>{userData.username}</p>
        <p className=' text-2xl mt-3 text-start'>{userData.fullname}</p>
        <p className=' text-1xl mt-3 items-start'>{userData.subscribersCount} Subscribers {userData.videosCount} Videos</p>
    </div>
    <div onClick={subscribe} className='mt-[100px]  pl-5'>
        <Button  subscribed={subscribed} bgColor='bg-red-600' className=' p-2 hover:translate-y-[1px]'>Subscriber</Button>
    </div>
</div>

<h1 className=' text-3xl  font-semibold  '>Videos:</h1>

<div className=' w-full py-8'>
    <Container>
        <div className=' flex flex-wrap'>
        {posts.map((post)=>(
            <div key={post._id} className=' p-3 w-1/4'>
                <PostCard {...post}/>
            </div>
        ))}
        </div>
    </Container>
</div>

</div>
    </div>
  )
}

export default ChannelProfile