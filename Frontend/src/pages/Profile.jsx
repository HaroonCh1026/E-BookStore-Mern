import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Profile/Sidebar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Loader from '../components/Loader/Loader'
import MobileNav from '../components/Profile/MobileNav'
const Profile = () => {
  const [userInfo, setUserInfo] = useState({})
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)

  const header = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`
  }

  useEffect(() => {
    const fetch = async () => {
      if (isLoggedIn) {
        const response = await axios.get("http://localhost:4000/api/v1/get-user-information", { headers: header });
        setUserInfo(response.data.user);
        console.log(userInfo);
        
      }
    }
    fetch()
  }, [isLoggedIn])

  return (
    <div className='bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row  py-8 gap-4 text-white'>
      {!userInfo && 
      <div className='w-full h-[100%] flex items-center justify-center'>

      <Loader />
      </div>
      }
      {userInfo && <>
        <div className='w-full md:w-1/6 h-auto lg:h-screen'><Sidebar data ={userInfo} />
        <MobileNav />
        </div>
        <div className='w-full md:w-5/6'><Outlet /></div>
      </>}
    </div>
  )
}

export default Profile
