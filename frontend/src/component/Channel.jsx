import axios from 'axios'
import React, { useState } from 'react'

const Channel = ({
    channel
}) => {

    const [sub,SetSub] = useState(true)

    const unsub = async()=>{
        const response  = await axios.post('/api/v1/subcription/toggleSubsciption',{
            "channelId":channel?._id,
        })

        if(response)
        {
            console.log("Succees")
            SetSub((prev)=>!prev)
        }else
        {
            console.error("Something went wrong")
        }
    }

  return (
    <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4 cursor-pointer' onClick={()=>navigate(`/video/${_id}`)}>
                <img src={channel?.avatar} alt='avatar'
                className='rounded-full w-[200px] h-[200px] mx-auto' />
            </div>
            <div className=' flex flex-1 cursor-pointer' >
                
            <h2
            className='text-lg font-bold ml-1'
            > {channel?.fullname}</h2>

            <div className={`ml-auto p-2 ${sub?"bg-gray-600" : "bg-red-500"} text-white rounded-md`} onClick={unsub}>
                {sub ?'UnSubscribed':"Subscribe"}
            </div>

            </div>
           
        </div>
  )
}

export default Channel