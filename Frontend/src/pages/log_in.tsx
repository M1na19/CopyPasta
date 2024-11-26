import { useState, useEffect } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import Cookies from "js-cookie"
import { redirect } from "react-router-dom";

function LogIn(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get("RefreshToken");
        if (token) {
          setIsLoggedIn(true);
          redirect('/');
        } else {
          setIsLoggedIn(false);
        }
    }, []);
    return (
      <>
        <NavbarCopyPasta signed_in={isLoggedIn} current_page='Home'/>
        <div className='oveflow-scroll-x h-full w-screen'>
          <div className={`relative flex items-center justify-center w-full h-1/4 md:h-full`} >
            <Background/>
            <Card className="flex flex-col items-center h-full w-[700px] mt-56 px-10 mb-10">
                <b className="text-4xl text-white mt-10 text-center">Loghează-te, chiorăie mațele!</b>
                
                <div className="flex items-center mt-32 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Nume"></input>
                </div>
                <div className="flex items-center mt-10 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    <input type="password" className="bg-transparent border-transparent outline-none text-white" placeholder="Parola"></input>
                </div>
                <button className="flex items-center justify-center bg-green-500 mt-20 rounded-2xl">
                    <b className="text-white px-10 py-2">Log In</b>
                </button>
                <a className="text-white mt-10 mb-10" href="/forgot">Forgot password</a>
            </Card>
          </div>
        </div>
      </>
    )
}
export default LogIn