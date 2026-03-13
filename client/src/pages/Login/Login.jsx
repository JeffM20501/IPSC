import React from 'react'
import IPSC from '../../assets/logo.png'
import './Login.css'
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'

function Login() {

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
                <FaEnvelope size={20}/>
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
            <p>Don't have an account?<Link to='/signup'>Sign up</Link></p>
        </form>

    </section>
  )
}

export default Login
