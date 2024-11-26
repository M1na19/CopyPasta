import { Navbar,Button } from "flowbite-react";
import clsx from 'clsx';
import { useEffect, useRef, useState } from "react";


export function NavbarCopyPasta({signed_in}: {signed_in: boolean;current_page: string;}) {
 
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement | null>(null); 
    
    let not_logged_mobile=<>
            <li>
              <a href="/register" className="text-black text-2xl">
                Register
              </a>
            </li>
            <li >
              <a href="/log_in" className="border-[5px] px-8 py-2 rounded-[2rem] border-blue-700 text-black text-2xl">
                Log In
              </a>
            </li>
    </>
    let logged_mobile=<>
            <li >
              <a href="/profile" className="border-[5px] px-8 py-2 rounded-[2rem] border-blue-700 text-black text-2xl">
                Profile
              </a>
            </li>
            <li>
              <a href="/log_out" className="text-black text-2xl">
                Register
              </a>
            </li>
    </>
    let not_logged_comp=<>
      <li className="text-2xl text-white rounded-[1.5rem] border-white border-4 px-6 py-2" ><a href="/log_in">Log In</a></li>
      <li className="text-2xl text-white" ><a href="/register">Register</a></li>
    </>
    let logged_comp=<>
      <li className="text-2xl text-white rounded-[1.5rem] border-white border-4 px-6 py-2" ><a href="/profile">Profile</a></li>
      <li className="text-2xl text-white" ><a href="/log_out">Log Out</a></li>
    </>
    useEffect(() => {
      const handleClickOutside = (event:MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node|null)) {
          setIsOpen(false);
        }
      };
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "hidden"; 
      }else{
        document.body.style.overflow = ""; 
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = ""; 
      };
    }, [isOpen]);
    return (
      <>
        <div className="h-10 md:h-24 md:bg-[#00236D] md:fixed md:w-full md:rounded-b-[24px] md:flex md:items-center z-50">
          <img className="hidden md:block ml-10" src="/logo_white.svg"></img>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="md:hidden mt-6 ml-6 h-10 w-10 border-2 border-black rounded-[0.5rem]" onClick={()=>setIsOpen(true)}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>
          <ul className="hidden md:block ml-[10vw] md:flex md:space-x-10 md:iterms-center">
            <li className="text-2xl text-white" ><a href="/">Home</a></li>
            <li className="text-2xl text-white" ><a href="/recipes">Recipes</a></li>
          </ul>

          <ul className="hidden md:block ml-auto md:flex md:space-x-10 md:items-center md:mr-20">
            {signed_in?logged_comp:not_logged_comp}
          </ul>
        </div>
      {/* Sidebar */}
      <div className={`md:hidden fixed inset-0 bg-opacity-50 backdrop-blur-sm z-30 ${isOpen ? "" : "hidden"}`}></div>
      <div
        ref={sidebarRef}
        className={`md:hidden bg-opacity-70 rouded-[10px] fixed top-0 left-0 h-full w-56 bg-gray-100 text-white transform z-40 flex flex-col justify-center ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <div className="mt-10">
          <ul className="mt-4  flex flex-col items-center justify-center">
            <li>
              <a href="/" className="text-black text-2xl block py-2">
                Home
              </a>
            </li>
            <li>
              <a href="/recipes" className="text-black text-2xl block py-2">
                Recipes
              </a>
            </li>
          </ul>
        </div>
        <ul className="mb-auto mt-56 flex flex-col items-center justify-center space-y-6">
          {signed_in?logged_mobile:not_logged_mobile}
        </ul>
      </div>
      </>
      
    );
  }
export function Background(){
    return <>
         <img
            src={`/background.svg`}
            alt="Background"
            className="absolute hidden md:block min-h-screen h-full object-cover w-full  top-0 left-0 -z-10"
          />
    </>
}
export function Card({children,className}:{children:any,className?:string}){
    return <>
      <div className={`bg-blue-800 rounded-[24px] ${className}`}>
        {children}
      </div>
    </>
}