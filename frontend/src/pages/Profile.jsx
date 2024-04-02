import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container , PostCard } from '../component'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const userData = useSelector((state) => state.auth.userData)
    // console.log(userData)
    const navigate = useNavigate()
    const [stat, setStat] = useState({})
    const [posts,setPosts] =useState([])

    useEffect(() => {
        

        axios.get('api/v1/dashboard/getStat')
            .then((item) => setStat(item.data?.data))

        axios.get('api/v1/dashboard/getChannel')
        .then((video)=>setPosts(video.data.data))
        .catch((err)=>console.error(err))

    }, [])

 


    return (
        <div className=' w-[90vw]  mx-5 p-4 '>

            <div className='w-full  overflow-hidden '>
                <img src={userData.coverImage} alt="banner" className=' w-[80vw] object-cover h-60 mx-auto rounded-sm border-red-400 border shadow-lg shadow-red-500 ' />
            </div>

            <div className=' w-full  flex'>
                <div className='p-3'>
                    <img src={userData.avatar} alt="owner" className=' w-[200px] h-[200px] rounded-full' />
                </div>

                <div className=' ml-6  items-start'>
                    <p className=' text-3xl mt-5 text-start font-bold '>@{userData.username}</p>
                    <p className=' text-2xl mt-3 text-start font-bold'>{userData.fullname}</p>
                    <p className=' text-1xl mt-3 font-semibold  items-start'>{stat.totalSubscriber} Subscribers {stat.totalVideos} Videos</p>
                    <p className=' text-1xl mt-3 font-semibold  items-start'>{stat?.subcribedTo}  Channel Subscribed</p>
                    <p className=' text-1xl mt-3 font-semibold items-start'>{stat?.totalLikes} Likes</p>
                </div>
                <div className=' p-2 ml-auto border-blue-300 border bg-blue-500  h-[8vh] text-center rounded-md my-auto cursor-pointer hover:bg-blue-600' onClick={()=>location.pathname === "/profile" &&
                  navigate("/profile/update")} >
                    Edit Profile
                </div>
            </div>
            {location.pathname !== "/profile" && (
          <div className=" h-[60vh] w-[40vw] top-[30%] left-[30%] bg-black rounded-md z-[9999] border-red-700 border-spacing-9 border-2 fixed">
            <Outlet />
          </div>
          )}
            <h1 className=' text-3xl  font-semibold  '>Videos:</h1>

            <div className=' w-full py-8'>
                <Container>
                    <div className=' flex flex-wrap'>
                    {posts.map((post)=>(
                        <div key={post._id} className=' p-3 w-1/4'>
                            <PostCard {...post} edit ={true}/>
                        </div>
                    ))}
                    </div>
                </Container>
            </div>

        </div>
    )
}

export default Profile