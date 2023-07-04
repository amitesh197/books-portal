import React from 'react'

function Info() {
  return (
    <div className='  flex justify-center'>
      <ol className='mt-10 text-center font-semibold  text-red-600 w-4/5 md:w-3/4'>
        <li className='my-10 font-bold text-3xl'>POINTS TO BE REMEMBERED</li>
        <li className='my-2'>When filling the status of excel sheets make sure that you do not put "not done". if there is a "done" word present in that cell. it will autmoatically detect that that task is done</li>
        <li className='my-2'>The text you keep inside the cell of status should nopt contain "done" word in it</li>
      </ol>
    </div>
  )
}

export default Info