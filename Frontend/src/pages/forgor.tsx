import { useState, useEffect } from "react";
import { NavbarCopyPasta, Background, Card } from "./modules";
import Cookies from "js-cookie"
import { redirect } from "react-router-dom";

function Forgor(){
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
                <b className="text-4xl text-white mt-10 text-center">Forgot password</b>
                
                <div className="flex items-center mt-20 space-x-4 border-b-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="stroke-white h-10 w-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <input type="text" className="bg-transparent border-transparent outline-none text-white" placeholder="Email"></input>
                </div>
                <button className="flex items-center justify-center bg-green-500 mt-20 mb-20 rounded-2xl">
                    <b className="text-white px-10 py-2">Send</b>
                </button>
            </Card>
          </div>
        </div>
      </>
    )
}
export default Forgor