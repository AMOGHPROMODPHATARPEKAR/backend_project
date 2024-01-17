import React from 'react'
import {useDispatch} from 'react-redux'
import {logout} from '../../store/authSlice'
import axios from 'axios'

const LogoutBtn = () => {
    const dispatch = useDispatch()
    const logoutHandler = async()=>{
        
        const user = await axios.post('api/v1/users/logout')
        if(user)
        {
            dispatch(logout())
        }

    }
  return (
    <button onClick={logoutHandler}
    className=' inline-block px-6 py-2 duration-200 hover:bg-blue-200 rounded-full'>Logout</button>
  )
}

export default LogoutBtn