import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'

export const SidebarData =[
{
    tittle:'Home',
    path:'/',
    icon:<AiIcons.AiFillHome/>,
    className:'nav-text'
},
{
    tittle:'Reports',
    path:'/reports',
    icon:<IoIcons.IoIosPaper/>,
    className:'nav-text'
},
{
    tittle:'Products',
    path:'/products',
    icon:<FaIcons.FaCartPlus/>,
    className:'nav-text'
},
]

