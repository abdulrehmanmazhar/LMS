'use client'
import React, {FC, useState} from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import {styles} from "../../styles/style"
type Props = {
    setRoute: (route: string)=> void;

}

const schema = Yup.object().shape({
    name: Yup.string().required("Please enter your name"),
    email: Yup.string().email("invalid email").required("Please enter your email"),
    password: Yup.string().required("Password is required").min(6)
})

const SignUp:FC<Props> = ({setRoute}) => {
    const [show, setShow] = useState(false);

    const formik = useFormik({
        initialValues:{email:'', password:"", name:""},
        validationSchema: schema,
        onSubmit: async({email, password, name})=>{
            console.log(email, password, name);
            setRoute('Verification')
        }
    })
    const {errors, touched, values, handleChange, handleSubmit} = formik;
  return (
    <div className='w-full'>
        <h1 className={`${styles.title}`}>
            Sign Up with LMS
        </h1>
        <form onSubmit={handleSubmit}>
            <label className={`${styles.label}`} htmlFor="name">Enter your Name</label>
            <input type="text" name='name' value={values.name} onChange={handleChange} id='name' placeholder='Name' className={`${errors.name && touched.name && "border-red-500"} ${styles.input}`} />
            {errors.name && touched.name && (
                <span className='text-red-500 pt-2 block mb-3'>{errors.name}</span>
            )}
            <div className='mt-5'></div>
            <label className={`${styles.label}`} htmlFor="email">Enter your Email</label>
            <input type="email" name='email' value={values.email} onChange={handleChange} id='email' placeholder='loginmail@smtp.com' className={`${errors.email && touched.email && "border-red-500"} ${styles.input}`} />
            {errors.email && touched.email && (
                <span className='text-red-500 pt-2 block'>{errors.email}</span>
            )}
            <div className="w-full mt-5 relative mb-1">
            <label className={`${styles.label}`} htmlFor="password">Enter your Password</label>
            <input type={!show? "password": "text"} name='password' value={values.password} onChange={handleChange} id='password' placeholder='Password' className={`${errors.password && touched.password && "border-red-500"} ${styles.input}`} />
            {errors.password && touched.password && (
                <span className='text-red-500 pt-2 block'>{errors.password}</span>
            )}
            {!show?(
                <AiOutlineEyeInvisible className='absolute top-11 right-2 z-1 cursor-pointer dark:text-white' size={20} onClick={()=>setShow(true)}/>
            ):(
                <AiOutlineEye className='absolute top-11 right-2 z-1 cursor-pointer dark:text-white' size={20} onClick={()=> setShow(false)}/>
            )}
            </div>
            <div className='w-full mt-5'>
                <input type="submit" value="sign up" className={`${styles.button}`} />
            </div>
            <br />
            <h5 className='text-center pt-4 font-Poppins text-[14px] text-black dark:text-white'>
                Or join with
            </h5>
            <div className='flex items-center justify-center my-3'>
                <FcGoogle size={30} className='cursor-pointer mr-2'/>
                <AiFillGithub size={30} className='cursor-pointer ml-2 dark:text-white'/>
            </div>
            <h5 className='text-center pt-4 font-Poppins text-[14px] dark:text-white'>
                Already have an account?{" "}
                <span className='text-[#2190ff] pl-1 cursor-pointer' onClick={()=>setRoute("Login")}>Login</span>
            </h5>
        </form>
    </div>
  )
}
export default SignUp;