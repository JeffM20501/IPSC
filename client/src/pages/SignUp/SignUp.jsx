import React, { useState } from 'react'
import './SignUp.css'
import IPSC from '../../assets/logo.png'
import {FaEnvelope, FaUser, FaEye, FaEyeSlash, FaLock, FaCoffee} from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'

function SignUp() {
    const navigate = useNavigate()

    const [formObj, setFormObj] = useState({
        fullname:'',
        email:'',
        password_hash:'',
        role:''
    })
    const [showPassword,setShowPassword]=useState(false)
    const [error,setError]=useState('')

    function handleChange(e){
        const {name,value}=e.target
        setFormObj({...formObj,[name]:value})
    }

    function toggleShowPassword(){
        setShowPassword(prev=>!prev)
    }

    async function handleSubmit(e){
        e.preventDefault()
        const configObj={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(formObj)
        }
        try{
            const r = await fetch('/api/signup',configObj)
            if (r.ok) {
                navigate('/login')
            }else{
                const err=await r.json()
                const errMsg=err.error?Array.isArray(err.error)?err.error[0]:err.error:'Sign up failed'
                // throw new Error (err.error||'Sign up Failed')
                setError(errMsg)
            }
        }catch(err){
            console.log(err)
            setError('Network Error')
        }

    }

  return (
    <section className='signup-page'>
        <img src={IPSC} alt='logo image'/>
        <h2>Create Your Account</h2>
        <h4>Join us to get started. It's free and easy</h4>

        <form className='sign-up-form' onSubmit={handleSubmit}>
            <label htmlFor="">
                <FaUser size={20}/>
                <input 
                    type="text" 
                    name='fullname'
                    placeholder='Fullname'
                    value={formObj.fullname}
                    onChange={handleChange}
                    required
                />
            </label>
            <label>
                <FaEnvelope size={20}/>
                <input 
                    type="email"
                    name='email'
                    placeholder='Email adress'
                    value={formObj.email}
                    onChange={handleChange}
                    required
                />
            </label>
            <label className='password-field'>
                <FaLock size={20}/>
                <input 
                    type={showPassword?'text':'password'} 
                    name='password_hash'
                    placeholder='Password'
                    value={formObj.password_hash}
                    onChange={handleChange}
                    required
                />
                <button type='button' className='toggle-password' onClick={toggleShowPassword}>
                    {showPassword?<FaEye size={20}/>:<FaEyeSlash size={20}/>}
                </button>
            </label>
            <label>
                <FaCoffee size={20}/>
                <input 
                    type="text" 
                    name='role'
                    placeholder='Role'
                    value={formObj.role}
                    onChange={handleChange}
                    required
                />
            </label>
            {error?<p className='error'>{error}</p>:null}
            <button type='submit'>Create Account</button>
            <p>Already have an account? <Link to='/login'>Sign In</Link></p>
        </form>
    </section>
  )
}

export default SignUp
