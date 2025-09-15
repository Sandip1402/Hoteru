import { useState } from "react";
import { Login } from "../components/Login";

export const Test = () => {
    const [showLogin, setShowLogin] = useState(false);
    return (
        <div>
            <Login />
        </div>
    )
}
