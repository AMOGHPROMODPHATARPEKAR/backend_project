import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Channel from '../component/Channel'

const Subscibed = () => {

    const user = useSelector((state) => state.auth.userData)

    const [channels,setChannels] = useState([])

    useEffect(()=>{

        axios.get(`/api/v1/subcription/subscribedTo/${user?._id}`)
        .then((item)=>setChannels(item?.data?.data))
        .catch((err)=>console.error(err))

    },[])
    console.log(channels)
  return (
    <div className=' w-[80vw] flex justify-center items-center mx-auto m-3'>
    <div className=' w-full  p-2 '>
        <div className='flex items-center justify-center space-x-4 my-4'>
    <h1 className=' font-serif  font-bold text-3xl text-center'>Subscribed Channel</h1> 
    
        </div>
        <div className=' flex flex-wrap'>
        {
            channels && channels.map((post)=>(
                <div key={post._id} className=' p-2 w-1/4'>
                    <Channel {...post}/>
                </div>
            ))
        }
        </div>

    </div>

</div>
  )
}

export default Subscibed