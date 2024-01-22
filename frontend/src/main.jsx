import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import {AddPost, Login, Signup, Video} from './component/index.js'
import Home from './pages/Home.jsx'

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
        }
        
      ]
    }
  ]
)


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <Provider store={store}>
      <RouterProvider router={router}/>
   </Provider>

  </React.StrictMode>,
)
