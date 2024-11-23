import Link from 'next/link';
import React, {FC} from 'react'


export const navItemData = [
    {
        name: 'Home',
        url: '/'
    },
    {
        name: 'Courses',
        url: '/courses'
    },
    {
        name: 'About',
        url: '/about'
    },
    {
        name: 'Policy',
        url: '/policy'
    },
    {
        name: 'FAQ',
        url: '/faq'
    },
]
type Props = {
    activeItem: number;
    isMobile: boolean;
}

const NavItems:FC<Props> = ({activeItem, isMobile}) => {
  return (
    <>
    <div className="hidden 800px:flex">
        {
            navItemData && navItemData.map((item, index)=>(
                <Link href={`${item.url}`} key={index} passHref>
                    <span className={`${activeItem === index ? "dark:text-[#37a39a] text-[crimson]":"dark:text-white text-black"} text-[18px] px-6 font-Poppins font-[400]`}>{item.name}</span>
                </Link>
            ))
        }
    </div>
    {
        isMobile &&(
            <div className='800px:hidden mt-5'>
                <div className='w-full flex flex-col items-stretch justify-between py-6 gap-6'>
                    {
                        navItemData&&navItemData.map((item, index)=>(
                            <Link href={item.url} passHref>
                                <span className={`${activeItem === index ? "dark:text-[#37a39a] text-[crimson]":"dark:text-white text-black"} text-[18px] px-6 font-Poppins font-[400]`}>{item.name}</span>
                            </Link>
                        ))
                    }
                </div>
            </div>
        )
    }
    </>
  )
}

export default NavItems