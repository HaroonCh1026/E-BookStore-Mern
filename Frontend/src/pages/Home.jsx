import React from 'react'
import Hero from '../components/Home/Hero'
import Recently from '../components/Home/RecentlyAdded'

const Home = () => {
  return (
    <div className='bg-zinc-900 text-white m-0 p-0'>
        <Hero />
        <Recently />
    </div>
  )
}

export default Home