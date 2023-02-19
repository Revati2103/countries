import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart} from '@fortawesome/free-solid-svg-icons';
import './footer.css'
const Footer = () => {
  return (
    <div className='footer'>
        <span>
    Made with <FontAwesomeIcon icon={faHeart} className='heart'/> by <a href="https://github.com/Revati2103" target="_blank" rel='noreferrer'>Revati</a>
</span>
    </div>
  )
}

export default Footer