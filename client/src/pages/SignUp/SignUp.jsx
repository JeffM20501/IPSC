import React, { useState } from 'react'
import './SignUp.css'
import IPSC from '../../assets/logo.png'
import {FaEnvelope, FaUser, FaEye, FaEyeSlash, FaLock, FaCoffee} from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'
import * as yup from 'yup'
import { useFormik } from 'formik'

function SignUp() {
    const navigate = useNavigate()

    const [showPassword,setShowPassword]=useState(false)
    const [error,setError]=useState('')


    function toggleShowPassword(){
        setShowPassword(prev=>!prev)
    }

    async function handleSubmit(values){
        const configObj={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(values)
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

    const formSchema=yup.object().shape({
            email:yup
                .string()
                .required('Email is required')
                .email('Invalid Email'),
            password_hash:yup
                .string()
                .required('Passwords is required')
                .min(8,'Password needs at least 8 Characters'),
            role:yup
                .string()
                .required('Role is required'),
            fullname:yup
                .string()
                .required('Full name is required')

    })

    const formik=useFormik({
        initialValues:{
            email:'',
            password_hash:'',
            fullname:'',
            role:''
        },
        validationSchema:formSchema,
        onSubmit:(values)=>handleSubmit(values)

    })

  return (
    <section className='signup-page'>
        <img src={IPSC} alt='logo image'/>
        <h2>Create Your Account</h2>
        <h4>Join us to get started. It's free and easy</h4>

        <form className='sign-up-form' onSubmit={formik.handleSubmit}>
            <label htmlFor="">
                <div>
                    <FaUser size={20}/>
                    <input 
                        type="text" 
                        name='fullname'
                        placeholder='Fullname'
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                </div>
                {formik.touched.fullname && formik.errors.fullname && (
                    <p  className='error'>{formik.errors.fullname}</p>
                )}
            </label>
            <label>
                <div>
                    <FaEnvelope size={20}/>
                    <input 
                        type="email"
                        name='email'
                        placeholder='Email adress'
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        required
                    />
                </div>
                {formik.touched.email && formik.errors.email && (
                    <p  className='error'>{formik.errors.email}</p>
                )}
            </label>
            <label className='password-field'>
                <div>
                    <FaLock size={20}/>
                    <input
                        name='password_hash'
                        placeholder='Password'
                        type={showPassword?'text':'password'}
                        value={formik.values.password_hash}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        required
                    />
                    <button type='button' className='toggle-password' onClick={toggleShowPassword}>
                        {showPassword ? <FaEye size={20}/>: <FaEyeSlash size={20}/>}
                    </button>
                </div>
                {formik.touched.password_hash && formik.errors.password_hash && (
                    <p  className='error'>{formik.errors.password_hash}</p>
                )}
            </label>
            <label>
                <div>
                    <FaCoffee size={20}/>
                <input 
                    type="text" 
                    name='role'
                    placeholder='Role'
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                />
                </div>
                {formik.touched.role && formik.errors.role && (
                    <p  className='error'>{formik.errors.role}</p>
                )}
            </label>
            {error?<p className='error'>{error}</p>:null}
            <button type='submit'>Create Account</button>
            <p>Already have an account? <Link to='/login'>Sign In</Link></p>
        </form>
    </section>
  )
}

export default SignUp
