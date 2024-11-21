import { Navbar,Button } from "flowbite-react";
import clsx from 'clsx';


export function NavbarCopyPasta({signed_in,current_page,}: {signed_in: boolean;current_page: string;}) {
    const isActive = (page: string) => {
      return current_page.toLowerCase() === page.toLowerCase();
    };
  
    return (
      <>
        <Navbar className="md:bg-[#00236D] md:rounded-b-[24px]" fluid>
          <Navbar.Toggle />
          <Navbar.Brand className="hidden md:block" href="/">
                <img src="/logo_white.svg" className="mr-3 h-20" alt="Flowbite React Logo" />
            </Navbar.Brand>
          <Navbar.Collapse className="flex items-center justify-between space-x-10">
                <div className="flex items-center justify-between space-x-10">
                    <Navbar.Link
                        className={clsx({"md:text-green-300":isActive('home')}, "md:text-white md:text-4xl md:text-center md:mt-7")}
                        href="#"
                    >
                        Home
                    </Navbar.Link>
                    <Navbar.Link
                        className={clsx({"md:text-green-300":isActive('recipes')}, "md:text-white md:text-4xl md:text-center md:mt-7")}
                        href="#"
                    >
                        Recipes
                    </Navbar.Link>
                </div>
                <div className="hidden flex justify-end md:right-1 md:block md:flex md:space-x-10 md:order-2 md:mr-5">
                    <Button size="sm" className="bg-transparent rounded-2xl border-white border-4">  
                        <span className="text-2xl ml-5 mr-5">Login</span>
                    </Button>
                    <Button size="sm" className="bg-transparent rounded-2xl border-4">  
                        <span className="text-2xl ml-5 mr-5">Register</span>
                    </Button>
                </div>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
export function Background(){
    return <>
         <img
            src={`/background.svg`}
            alt="Background"
            className="absolute hidden md:block h-full object-cover w-full  top-0 left-0 -z-10"
          />
    </>
}