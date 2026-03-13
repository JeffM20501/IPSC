import React from 'react'
import IPSC from '../assets/logo.png'
import './css/Header.css'
import HeaderUserProfile from './HeaderUserProfile'

function Header({user}) {

  return (
    <header className='main-header'>
        <div className='main-header-logo'>
            <img src={IPSC}/>
            <p>Inventory Prediction and Supply Chain- (IPSC)</p>
        </div>
        
        {user?<HeaderUserProfile
          key={user.id}
          name={user.fullname}
          avatar={user.profile_image}
        />:null}
        
    </header>
  )
}

export default Header