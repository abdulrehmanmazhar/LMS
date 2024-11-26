'use client'
import React, {FC, useEffect, useState} from 'react'
import Link from 'next/link'
import NavItems from '../utils/NavItems'
import ThemeSwitcher from '../utils/ThemeSwitcher'
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from 'react-icons/hi'
import CustomModel from '../utils/CustomModel'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import Verification from './auth/Verification'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import avatar from "../../public/avatar.png"
import { useSession } from 'next-auth/react'
import { useSocialAuthMutation } from '@/redux/features/auth/authApi'
import toast from 'react-hot-toast'
type Props = {
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string)=> void
}

const Header:FC<Props> =({activeItem,setOpen, route, setRoute, open})=> {
    const[active, setActive] = useState(false);
    const[openSlidebar, setOpenSlidebar] = useState(false);
    const {user} = useSelector((state:any)=>state.auth)
    const {data} = useSession();

    // console.log(data);
    const [socialAuth,{isSuccess,error}] = useSocialAuthMutation();
    useEffect(()=>{
        if(!user){
            if(data){
                socialAuth({email:data?.user?.email, name:data?.user?.name, avatar:data?.user?.image})
            }
        }
        if(isSuccess){
            toast.success("Login successfully");
        }
    },[data, user]);

    if(typeof window !== "undefined"){
        window.addEventListener("scroll",()=>{
            if(window.scrollY > 80){
                setActive(true)
            }else{
                setActive(false)
            }
        })
    }

    const handleClose = (e:any) =>{
        if(e.target.id === 'screen'){
            setOpenSlidebar(false);
        }
    }
    console.log(user)
  return (
    <div className='w-full relative'>
        <div className={`${active? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500":"w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"}`}>
            <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                <div className="w-full h-[80px] flex items-center justify-between p-3">
                    <div>
                        <Link href={'/'} className={`text-[25px] font-Poppins font-[500] text-black dark:text-white`}>LMS</Link>
                    </div>
                    <div className="flex items-center">
                        <NavItems activeItem={activeItem} isMobile={false}></NavItems>
                        <ThemeSwitcher/>
                        {/* only for mobile screen */}
                        <div className="800px:hidden">
                            <HiOutlineMenuAlt3 size={25} className='cursor-pointer dark:text-white text-black' onClick={()=>setOpenSlidebar((prev)=>!prev)}/>
                        </div>
                        {
                            user?(
                                <>
                                <Link href={'/profile'}>
                                <Image className='w-[30px] h-[30px] rounded-full cursor-pointer' src={user.avatar? user.avatar:avatar} alt='user image'/></Link></>
                            ):(

                                <HiOutlineUserCircle size={25} className='cursor-pointer dark:text-white text-black hidden 800px:flex' onClick={()=>setOpen((prev)=>!prev)}/>
                            )
                        }
                    </div>
                </div>
            </div>
            {/* mobile sidebar */}
            {
                openSlidebar && (
                    <div className='fixed w-full h-screen top-0 left-0 z-[9999] dark:bg-[unset] bg-[#00000024]' onClick={handleClose} id='screen'>
                        <div className="w-[70%] fixed z-[999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                            <NavItems activeItem={activeItem} isMobile={true}></NavItems>
                            <HiOutlineUserCircle size={25} className='cursor-pointer dark:text-white text-black' onClick={()=>setOpen((prev)=>!prev)}/>
                                <br /><br />
                            <p className='text-[16px] px-2 pl-5 dark:text-white text-black'>Copyright © 2024 LMS</p>
                        </div>
                    </div>
                )
            }
        </div>
        {
            route === "Login" && (
                <>
                {
                    open && (
                        <CustomModel open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} component={Login}/>
                    )
                }
                </>
            )
        }
        {
            route === "Sign-Up" && (
                <>
                {
                    open && (
                        <CustomModel open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} component={SignUp}/>
                    )
                }
                </>
            )
        }
        {
            route === "Verification" && (
                <>
                {
                    open && (
                        <CustomModel open={open} setOpen={setOpen} activeItem={activeItem} setRoute={setRoute} component={Verification}/>
                    )
                }
                </>
            )
        }
    </div>
  )
}

export default Header