import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container , PostCard } from '../component'

const Profile = () => {
    const userData = useSelector((state) => state.auth.userData)
    // console.log(userData)

    const [stat, setStat] = useState({})
    const [posts,setPosts] =useState([])

    useEffect(() => {

        axios.get('api/v1/dashboard/getStat')
            .then((item) => setStat(item.data?.data))

        axios.get('api/v1/dashboard/getChannel')
        .then((video)=>setPosts(video.data.data))
        .catch((err)=>console.error(err))

    }, [])

    console.log(posts)


    return (
        <div className=' w-[80vw]  mx-10 p-4 '>

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
                    <p className=' text-1xl mt-3 items-start'>{stat.totalSubscriber} Subscribers {stat.totalVideos} Videos</p>
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
    )
}

export default Profile