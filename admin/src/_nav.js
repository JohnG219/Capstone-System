import React from 'react'
import CIcon from '@coreui/icons-react'
import { AuthContext } from './context/AuthContext'
import {
  cilDescription,
  cilHistory,
  cilMoney,
  cilNewspaper,
  cilSpeedometer,
  cilStar,
  cilUser,
  cilPhone,
  cilPlus,
  cilCalendar,
  cibMessenger,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Details',
  },
  
  {
    component: CNavItem,
    name: 'Transaction History',
    to: '/transactionhistory',
    icon: <CIcon icon={cilHistory} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Monthly Basis',
    to: '/',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Bill Records',
    to: '/billrecords',
    icon: <CIcon icon={cilNewspaper} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Add Stalls T.',
    to: '/addstallst',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Profile',
    to: '/profile',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  
  {
    component: CNavTitle,
    name: 'ABOUT',
  },
  {
    component: CNavGroup,
    name: 'Message',
    icon: <CIcon icon={cibMessenger} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Stalls Tenants',
        to: '/',
      },
      
    ],
  },
]

export default _nav