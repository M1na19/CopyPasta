import React, { useState, createRef, useEffect } from "react";
import { NavbarCopyPasta, Background, StarBuilder } from "./modules";
import { Recipe, request } from "../requests";
import { is_logged_in } from "../requests";

import RecipePopUp from "./recipe";

class List extends React.Component {
  state = {
    full_search: [] as Recipe[],
    showing: null as string | null,
  };

  componentDidMount(): void {
    request("http://localhost:8000/list", "GET").then((data) => {
      const recipes: Recipe[] = data.list;

      this.setState({
        full_search: recipes,
      });
    });
  }

  render(): React.ReactNode {
    if (!this.state.full_search) {
      return <p>Loading...</p>;
    }
    const images: React.ReactNode[] = [];
    this.state.full_search.forEach((rec, idx) => {
      if (rec.images == null) {
        rec.images = ["basic.webp"];
      }
      images.push(
        <React.Fragment key={idx}>
          <button
            className="flex flex-col items-center border-black border-2 w-56 mt-10 md:mr-10 md:ml-10  bg-white"
            onClick={() => {
              this.setState({ showing: rec.uuid });
            }}
          >
            {this.state.showing === rec.uuid && (
              <RecipePopUp
                uuid={rec.uuid}
                reseter={() => {
                  this.setState({ showing: "" }, () => {
                    this.setState({ showing: null });
                    document.body.style.overflow = "auto";
                  });
                }}
              />
            )}
            <img
              src={`/images/${rec.images![0]}`}
              className="max-w-56 h-56 border-r-green-700 border-2"
            ></img>
            <div className="bg-white max-w-56 h-56 flex flex-col items-center">
              <b className="text-xl mt-8">{rec.name}</b>
              <div className="mt-2">
                <StarBuilder num_stars={rec.rating || 0} />
              </div>
              <p className="mt-7">Author:</p>
              <p>{rec.users.username}</p>
            </div>
          </button>
        </React.Fragment>,
      );
    });

    return (
      <>
        <div className="flex flex-wrap items-center justify-center w-full">
          {images}
        </div>
      </>
    );
  }
}
function MyList() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    is_logged_in().then((l) => {
      setIsLoggedIn(l);
      if (l == false) {
        history.back();
      }
    });
  }, []);

  return (
    <>
      <NavbarCopyPasta signed_in={isLoggedIn} current_page="Home" />
      <div className="oveflow-scroll-y min-h-full w-full">
        <div
          className={`relative flex flex-col items-center justify-center w-full h-1/4 md:h-full max-md:px-[1vw] px-10 `}
        >
          <Background />
          <object
            className="md:hidden md:mt-20 inline-block w-full max-w-xs"
            data="/logo.svg"
            type="image/svg+xml"
          ></object>
          <div className="mt-32 w-full flex flex-col px-20 items-center justify-center space-y-10">
            <b className="text-4xl">Personal List</b>
            <List />
          </div>
        </div>
      </div>
      <div className="relative md:hidden flex items-center h-screen">
        <img
          className="mt-20 object-cover h-40 w-full mt-auto"
          src="/foot_mobile.svg"
          alt="Footer"
        />
      </div>
    </>
  );
}
export default MyList;
