'use client'
import React, {FC, useState, useEffect} from 'react'
import { useTheme } from 'next-themes'
import { BiMoon, BiSun } from 'react-icons/bi'
type Props = {}

const ThemeSwitcher:FC<Props> = () => {
    const [mounted, setMounted ] = useState(false)
    const {theme, setTheme} = useTheme();

    useEffect(()=> setMounted(true),[]);

    if(!mounted){return null};
  return (
    <div className='flex items-center justify-center mx-4'>
        {
            theme ==="light"?(
                <BiMoon className='cursor-pointer' fill='black' size={25} onClick={()=>setTheme("dark")}/>
            ):(
                <BiSun size={25} className='cursor-pointer' fill='white' onClick={()=>setTheme("light")}/>
            )
        }
    </div>
  )
}

export default ThemeSwitcher