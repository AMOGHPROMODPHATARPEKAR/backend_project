import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {AddPost, Login, Signup, Video} from './component/index.js'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import ChannelProfile from './pages/ChannelProfile.jsx'

const router = createBrowserRouter(
  [
    {
      path:'/',
      element:<App />,
      children:[
        {
          path:'/',
          element:<Home/>
        },
        {
          path:'/signup',
          element:<Signup/>
        },{
          path:'/login',
          element:<Login/>
        },
        {
          path:'/video/:id',
          element:<Video/>
        },
        {
          path:'/add-post',
          element:<AddPost/>
        },
        {
          path:'/profile',
          element:<Profile/>
        },
        {
          path:'/channel/:id',
          element:<ChannelProfile/>
        }
      ]
    }
  ]
)


ReactDOM.createRoot(document.getElementById('root')).render(
  
   <Provider store={store}>
      <RouterProvider router={router}/>
   </Provider>

)
