import React,{useState,useEffect} from 'react'
import { Container , PostCard } from '../component'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
    const [posts,setPosts] = useState([])
    const status = useSelector((state)=>state.auth.status);
    // const video = async()=>{
        
    //     try {
    //         const videos = await axios('api/v1/videos/getAllVideo');
    //         console.log(videos.data.data);
    //         setPosts(videos.data.data)
    //         console.log("p",posts)

    //     } catch (error) {
    //         console.error(error)
    //     }

    // }

    useEffect(()=>{
        axios('api/v1/videos/getAllVideo').then((video)=> setPosts(video.data.data))
        .catch((error)=>console.log(error))
    },[])

    if (!status) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                <Link
                                to='/login'
                                >Login</Link>to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

  return (
    <div className=' w-full py-8'>
        <Container>
            <div className=' flex flex-wrap'>
            {posts.map((post)=>(
                <div key={post._id} className=' p-2 w-1/4'>
                    <PostCard {...post}/>
                </div>
            ))}
            </div>
        </Container>
    </div>
  )
}

export default Home