import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {FaHistory} from 'react-icons/fa'
import WatchCard from '../component/WatchCard'

const WatchHistory = () => {

    const [history,setHistory] = useState([])

    useEffect(()=>{
        axios.get('/api/v1/users/history')
        .then((item)=> setHistory(item?.data?.data))
        .catch((err)=>console.error(err))
    },[history])

  return (
    <div className=' w-[80vw] flex justify-center items-center mx-auto m-3'>
        <div className=' w-full  p-2 '>
            <div className='flex items-center justify-center space-x-4 my-4'>
        <h1 className=' font-serif  font-bold text-3xl text-center'>Watch History</h1> 
        <FaHistory size={20}/>
            </div>
            <div className=' flex flex-wrap'>
            {history.map((post)=>(
                <div key={post._id} className=' p-2 w-1/4'>
                    <WatchCard {...post}/>
                </div>
            ))}
            </div>

        </div>

    </div>
  )
}

export default WatchHistory