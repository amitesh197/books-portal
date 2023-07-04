import React from 'react'

function NotLoggedin() {
  return (
    <div className='flex flex-col justify-center items-center text-red-400'>
        <p className='text-xl mt-20 sm:text-4xl sm:mt-40'>You are Logged Out</p>
        <p className='text-xl mt-20 sm:text-4xl sm:mt-40'>Login again</p>
    </div>
  )
}

export default NotLoggedin