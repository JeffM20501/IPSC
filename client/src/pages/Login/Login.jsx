import React from 'react'
import IPSC from '../../assets/logo.png'
import './Login.css'
import { useState } from 'react'
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from "formik";
import * as yup from 'yup'

function Login() {

    const navigate=useNavigate()


    const [serverError,setServerError]=useState('')
    const [showPassword,setShowPassword]=useState(false)
    

    async function handleSubmit(values){
        const config_obj={
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(values)
        }
    
        const r = await fetch('/api/login',config_obj)
        if (r.ok){
            navigate('/')
        }else{
            const err= await r.json()
            setServerError(err.error||'Login Failed')
        }
    }

    const formSchema=yup.object().shape({
        email:yup
            .string()
            .required('Email is required')
            .email('Invalid Email'),
        password:yup
            .string()
            .required('Passwords is required')
            .min(8,'Password needs at least 8 Characters'),
    })

    const formik=useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema:formSchema,
        onSubmit:(values)=>handleSubmit(values)

    })
    
    function toggleShowPassword(){
        setShowPassword(prev=>!prev)
    }

  return (
    <section className='login-page'>
        <img src={IPSC} alt='logo image'/>
        <h2>Sign In to Your Account</h2>
        <h4>Welcome back. Please enter your details</h4>
        
        <form className='sign-in-form' onSubmit={formik.handleSubmit}>
            <label htmlFor="">
                <div>
                    <FaEnvelope size={20}/>
                    <input
                        name='email'
                        placeholder='Email Address'
                        type='email'
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        required
                    />
                </div>
                {formik.touched.email && formik.errors.email && (
                    <p className='error'>{formik.errors.email}</p>
                )}
            </label>
            <label htmlFor="" className='password-field'>
                <div>
                    <FaLock size={20}/>
                    <input
                        name='password'
                        placeholder='Password'
                        type={showPassword?'text':'password'}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        required
                    />
                    <button type='button' className='toggle-password' onClick={toggleShowPassword}>
                        {showPassword ? <FaEye size={20}/>: <FaEyeSlash size={20}/>}
                    </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                    <p  className='error'>{formik.errors.password}</p>
                )}
            </label>
            {serverError&&<p className='error'>{serverError}</p>}
            <button type='submit'>Sign In</button>
            <p>Don't have an account?<Link to='/signup'>Sign up</Link></p>
        </form>

    </section>
  )
}

export default Login
