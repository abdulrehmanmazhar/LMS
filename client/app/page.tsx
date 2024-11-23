'use client'

import React, {FC, useState} from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";

interface Props{}

const Home : FC<Props> = (props) =>{
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return(
    <div>
      <Heading title="LMS" description="NEXTJS project" keywords="nextjs, MERN, React-Native"/>
      <Header open={open} setOpen={setOpen} activeItem={activeItem}/>
      <Hero/>
    </div>
  )
}

export default Home;