import React, { useEffect, useState } from 'react'
import { Background, Card, NavbarCopyPasta } from './modules'
import Cookies from "js-cookie"
import { Recipe, request } from '../requests';

function StarBuilder({num_stars}:{num_stars:number}){
  let Stars:React.ReactNode[]=[];
  for(let i=0;i<5;i++){
    Stars.push(
      <svg
        key={i} // This is the unique key for each star
        className='min-h-6 min-w-6 max-h-8 max-w-8'
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="50,5 61,35 95,35 68,57 78,91 50,70 22,91 32,57 5,35 39,35" fill="lightgray" />
        <defs>
          <clipPath id={`partial-fill-${i}`}>
            <rect x="0" y="0" width={`${Math.max(0, Math.min(num_stars, 1)) * 100}%`} height="100%" />
          </clipPath>
        </defs>
        <polygon
          points="50,5 61,35 95,35 68,57 78,91 50,70 22,91 32,57 5,35 39,35"
          fill="gold"
          clipPath={`url(#partial-fill-${i})`}
        />
      </svg>
    );
    num_stars--; // Decrement num_stars
  }
  
  return <>
    <div className='flex items-center'>
      {Stars}
    </div>
  </>

}

class RecipePromo extends React.Component{
  state:{data:Recipe[]}={
    data: []
  }
  componentDidMount(): void {
    request("http://localhost:8000/recipes","GET")
      .then((data)=>{
        let recipes:Recipe[]=data.recipes
        recipes.sort((a,b)=>{return (a.rating || 0) - (b.rating || 0)})
        let nr=1;
        const { innerWidth: width, innerHeight: _ } = window;
        if(width>800)nr++;
        if(width>1200)nr++;
        recipes=recipes.slice(0,nr);
        
        recipes.map((rec)=>{
          if(rec.images==null){
            rec.images=['basic.webp']
          }
        })
        this.setState({data:recipes});
      })
  }
  componentDidUpdate(): void {
    request("http://localhost:8000/recipes","GET")
      .then((data)=>{
        let recipes:Recipe[]=data.recipes
        recipes.sort((a,b)=>{return (a.rating || 0) - (b.rating || 0)})
        let nr=1;
        const { innerWidth: width, innerHeight: _ } = window;
        if(width>800)nr++;
        if(width>1200)nr++;
        recipes=recipes.slice(0,nr);
        
        recipes.map((rec)=>{
          if(rec.images==null){
            rec.images=['basic.webp']
          }
        })
        this.setState({data:recipes});
      })
  }
  render(): React.ReactNode {
    let images:React.ReactNode[]=[];
    this.state.data.forEach((rec,idx)=>{
      images.push(<>
        <div key={idx} className='flex items-center border-black border-2 h-full w-full'>
          <img src={`/images/${rec.images![0]}`} className='max-w-56 h-56 border-r-green-700 border-2'></img>
          <div className='bg-white max-w-56 h-56 flex flex-col items-center'>
            <b className='text-xl mt-8'>{rec.name}</b>
            <div className='mt-2'>
              <StarBuilder num_stars={rec.rating || 0}/>
            </div>
            <p className='mt-7'>Author:</p>
            <p>{rec.users.username}</p>
          </div>
        </div>
      </>)
    })
    return images;
  }
}

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const token = Cookies.get("RefreshToken");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
  }, []);
  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page='Home'/>
      <div className='oveflow-scroll-x h-screen w-screen'>
        <div className={`relative flex items-center justify-center w-full h-1/4 md:h-full`} >
          <Background/>
          <object 
            className="md:mt-20 inline-block h-auto w-full max-w-xs md:max-w-xl" 
            data='/logo.svg'
            type="image/svg+xml"
          >
          </object>
        </div>
        <div className='flex flex-col items-center justify-between bg-blue-900 w-full md:space-y-10'>
          <b className='text-center text-white text-4xl  md:text-6xl mt-10 mb-20'>Top Rated Recipes</b>
          <div className='md:flex items-center justify-between space-x-20 pb-10'>
            <RecipePromo/>
          </div>
        </div>
        <div className='bg-white flex flex-col items-center justify-center'>
            <img className="mt-10" src='/contact_us.svg'></img>
            <img src="/foot.svg"></img>
        </div>
      </div>
    </>
  )
}

export default Main
