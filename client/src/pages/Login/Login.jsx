import React from 'react'
import IPSC from '../../assets/logo.png'
import './Login.css'
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Login({onLogin}) {

    const navigate=useNavigate()

    const [formObj,setFormObj]=useState({
        email:'',
        password:''
    })
    const [error,setError]=useState([])
    const [showPassword,setShowPassword]=useState(false)
    
    function handleChange(e){
        const {name,value}=e.target
        setFormObj({...formObj, [name]:value})
    }
    
    function toggleShowPassword(){
        setShowPassword(prev=>!prev)
    }

    async function handleSubmit(e){
        e.preventDefault();
        const config_obj={
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formObj)
        }
    
        const r = await fetch('/api/login',config_obj)
        if (r.ok){
            const user = await r.json()
            onLogin(user)
            navigate('/')
        }else{
            const err= await r.json()
            setError(err.error||'Login Failed')
        }
    }

  return (
    <section className='login-page'>
        <img src={IPSC} alt='logo image'/>
        <h2>Sign In to Your Account</h2>
        <h4>Welcome back. Please enter your details</h4>
        
        <form className='sign-in-form' onSubmit={handleSubmit}>
            <label htmlFor="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/>
                </svg>

                <input
                    name='email'
                    placeholder='Email Address'
                    type='email'
                    value={formObj.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <label htmlFor="" className='password-field'><FaLock size={20}/>
                <input
                    name='password'
                    placeholder='Password'
                    type={showPassword?'text':'password'}
                    value={formObj.password}
                    onChange={handleChange}
                    required
                />

                <button type='button' className='toggle-password' onClick={toggleShowPassword}>
                    {showPassword ? <FaEye size={20}/>: <FaEyeSlash size={20}/>}
                </button>
            </label>
            {error&&<p className='error'>{error}</p>}
            <button type='submit'>Sign In</button>
            <p>Don't have an account? <a href='#'>Sign Up</a></p>
        </form>

    </section>
  )
}

export default Login
