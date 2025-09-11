import React from 'react'
import { Logo } from './Logo'

const Footer = () => {

    

    return (
        <footer className="footer sm:footer-horizontal bg-base-300 text-base-content p-10">
            <aside className="text-3xl text-center">
                <Logo customStyle={"footer-logo"}/>
            </aside>
            <nav>
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
                <a className="link link-hover">Customer support</a>
            </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
            </nav>
            <nav>
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
            </nav>
        </footer>
    )
}
export default Footer