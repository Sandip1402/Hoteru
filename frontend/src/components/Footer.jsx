import { Link } from "react-router"
const Footer = () => {



    return (
        <footer className="footer sm:footer-horizontal bg-base-300 p-10">
            <aside className="w-max h-max">
                <Link className="outline-none" to="/">
                    <img className="w-20 h-20" src="/Icons/Logo.png" alt="logo" />
                </Link>
            </aside>
            <nav className="max-sm:px-2">
                <h6 className="footer-title">Services</h6>
                <a className="link link-hover">Marketing</a>
                <a className="link link-hover">Advertisement</a>
                <a className="link link-hover">Customer support</a>
            </nav>
            <nav className="max-sm:px-2">
                <h6 className="footer-title">Company</h6>
                <a className="link link-hover">About us</a>
                <a className="link link-hover">Contact</a>
            </nav>
            <nav className="max-sm:px-2">
                <h6 className="footer-title">Legal</h6>
                <a className="link link-hover">Terms of use</a>
                <a className="link link-hover">Privacy policy</a>
            </nav>
        </footer>
    )
}
export default Footer