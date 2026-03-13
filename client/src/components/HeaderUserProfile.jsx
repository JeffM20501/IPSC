import React from 'react'
import './css/HeaderUserProfile.css'
import { FaUser } from 'react-icons/fa'

function HeaderUserProfile({name, avatar}) {
  return (
    <div className='header-user-profile'>
        {avatar?<img src={avatar} alt="user profile image" />:<FaUser/>}
        <p className='user-username'>{name}</p>
    </div>
  )
}

export default HeaderUserProfile