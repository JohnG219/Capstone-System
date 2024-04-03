import React from 'react'
import { useContext, useState } from "react"
import { AuthContext } from '../../context/AuthContext'
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./styleapp.css";
import Swal from 'sweetalert2';


import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilCreditCard,
  cilEnvelopeOpen,
  cilSettings,
  cilToggleOff,
  cilUser,
  cibGravatar,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  const { user }=useContext(AuthContext)
  const {dispatch}=useContext(AuthContext)

  const handleClick = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Log out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({
          type: 'LOGOUT',
        });
        navigate('/');
      }
    });
  };  

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
      {user ? (
          <div className="d-flex align-items-center">
            <CAvatar src={user.img} size="md" />
            <span className="ms-2">{user.username} {user.surname}</span>
          </div>
        ) : (
          <Link to="/login" className="nav-link">
            Log In
          </Link>
        )}
      </CDropdownToggle>
      
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>

        <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            0
          </CBadge>
        </CDropdownItem>
        
        
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            1
          </CBadge>
        </CDropdownItem>
        
        <CDropdownDivider />
        <CDropdownItem onClick={handleClick} className="logout-item">
          <CIcon icon={cibGravatar} className="me-2" style={{ color: '#b23b3b' }} />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown