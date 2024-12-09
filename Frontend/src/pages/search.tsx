import React, { useState, createRef, useEffect } from "react";
import { NavbarCopyPasta, Background, StarBuilder } from "./modules";
import Cookies from "js-cookie";
import { is_logged_in } from "../requests";

import { Recipe, request } from "../requests";
import RecipePopUp from "./recipe";
class FilterCriteria {
  rating_above: number | null = null;
  cook_time_bellow: number | null = null;
  difficulty_bellow: number | null = null;
  type: string | null = null;
}
enum SortCriteria {
  TIME,
  DIFFICULTY,
  COOK_TIME,
  NAME,
  RATING_ASC,
  RATING_DES,
}
class SearchList extends React.Component {
  state = {
    full_search: [] as Recipe[],
    filtered: [] as Recipe[],
    search: "",
    fc: new FilterCriteria(),
    sort: SortCriteria.TIME,
    showing: null as string | null,
  };

  componentDidMount(): void {
    request("http://localhost:8000/recipes", "GET").then((data) => {
      const recipes: Recipe[] = data.recipes;

      this.setState(
        {
          full_search: recipes,
          filtered: recipes,
          search: "",
          fc: new FilterCriteria(),
          sort: SortCriteria.TIME,
        },
        () => {
          this.handleChange();
        },
      );
    });
  }

  handleChange = () => {
    const recipes = this.state.full_search;
    const filtered = recipes.filter((rec) => {
      const is_searched = rec.name
        .toLowerCase()
        .includes(this.state.search.toLowerCase());
      let is_filtered = true;
      const fc = this.state.fc;
      if (fc.cook_time_bellow != null && fc.cook_time_bellow > 0.25) {
        is_filtered =
          is_filtered &&
          rec.cookingTime != null &&
          rec.cookingTime <= fc.cook_time_bellow;
      }
      if (fc.difficulty_bellow != null && fc.difficulty_bellow > 0.25) {
        is_filtered =
          is_filtered &&
          rec.difficulty != null &&
          rec.difficulty <= fc.difficulty_bellow;
      }
      if (fc.rating_above != null && fc.rating_above > 0.25) {
        is_filtered =
          is_filtered && rec.rating != null && rec.rating >= fc.rating_above;
      }
      if (fc.type != null) {
        is_filtered =
          is_filtered && rec.types.name != null && rec.types.name == fc.type;
      }
      return is_searched && is_filtered;
    });
    filtered.sort((a, b) => {
      switch (this.state.sort) {
        case SortCriteria.COOK_TIME: {
          return (a.cookingTime || 0) - (b.cookingTime || 0);
        }
        case SortCriteria.RATING_ASC: {
          return (a.rating || 0) - (b.rating || 0);
        }
        case SortCriteria.RATING_DES: {
          return -(a.rating || 0) + (b.rating || 0);
        }
        case SortCriteria.TIME: {
          return a.uploadTime.valueOf() - b.uploadTime.valueOf();
        }
        case SortCriteria.DIFFICULTY: {
          return (a.difficulty || 0) - (b.difficulty || 0);
        }
        case SortCriteria.NAME: {
          return a.name.localeCompare(b.name);
        }
      }
    });
    this.setState({ filtered: filtered });
  };

  openFilterDrop = () => {};
  closeFilterDrop = () => {};

  openSortDrop = () => {};
  closeSortDrop = () => {};

  render(): React.ReactNode {
    const images: React.ReactNode[] = [];
    this.state.filtered.forEach((rec, idx) => {
      if (rec.images == null || rec.images[0] == "") {
        rec.images = ["/images/basic.webp"];
      }
      console.log(rec.images);
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
              src={`${rec.images![0]}`}
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

    const searchRef = createRef<HTMLInputElement>();

    const sortRef = createRef<HTMLUListElement>();
    const filterRef = createRef<HTMLUListElement>();

    const starRef = createRef<HTMLDivElement>();
    const diffRef = createRef<HTMLInputElement>();
    const timeRef = createRef<HTMLInputElement>();

    return (
      <>
        <div className="max-w-96 flex w-full rounded-xl border-2 border-black ">
          <input
            className="outline-none w-full border-transparent bg-transparent"
            ref={searchRef}
            onChange={() => {
              this.setState({ search: searchRef.current?.value });
            }}
            type="search"
          />
          <button onClick={this.handleChange}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>
        <div className="w-full flex items-center justify-center flex-wrap md:space-x-4 max-[350px]:space-y-2">
          <div
            tabIndex={0}
            onBlur={(e) => {
              if (e.relatedTarget == null) {
                filterRef.current?.classList.add("hidden");
                sortRef.current?.classList.add("hidden");
              }
            }}
            className="flex flex-col items-center border-2 rounded-xl px-8 py-1 border-black"
          >
            <button
              onClick={() => {
                filterRef.current?.classList.remove("hidden");
              }}
            >
              Filter
            </button>
            <ul ref={filterRef} className="hidden ul">
              <li className="flex w-56">
                <p>Rating</p>
                <div
                  ref={starRef}
                  className="ml-auto"
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                  ) => {
                    if (starRef) {
                      const rect = starRef.current!.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const fc = this.state.fc;
                      fc.rating_above = x / (rect.width / 5);
                      fc.rating_above = Math.floor(fc.rating_above / 0.5) * 0.5;
                      this.setState({ fc: fc }, this.handleChange);
                    }
                  }}
                >
                  <StarBuilder num_stars={this.state.fc.rating_above || 0} />
                </div>
              </li>
              <li className="flex w-56">
                <p>Dificultate maxima</p>
                <input
                  ref={diffRef}
                  type="range"
                  className="ml-auto"
                  onLoad={() => {
                    diffRef.current!.value = "0";
                  }}
                  onChange={() => {
                    const fc = this.state.fc;
                    //@ts-expect-error (String as num)
                    fc.difficulty_bellow = diffRef.current?.value / 20;
                    this.setState({ fc: fc }, this.handleChange);
                  }}
                />
              </li>
              <li className="flex w-56 items-center">
                <p>Timp maxim</p>
                <input
                  ref={timeRef}
                  type="number"
                  className="ml-auto text-center outline-none bg-transparent w-20"
                  onChange={() => {
                    const fc = this.state.fc;
                    //@ts-expect-error (String as num)
                    fc.cook_time_bellow = timeRef.current?.value / 20;
                    this.setState({ fc: fc }, this.handleChange);
                  }}
                />
              </li>
            </ul>
          </div>
          <div
            tabIndex={0}
            onBlur={(e) => {
              if (e.relatedTarget == null) {
                sortRef.current?.classList.add("hidden");
                filterRef.current?.classList.add("hidden");
              }
            }}
            className="flex flex-col items-center border-2 rounded-xl px-8 py-1 border-black"
          >
            <button
              onClick={() => {
                sortRef.current?.classList.remove("hidden");
              }}
            >
              Sort
            </button>
            <ul ref={sortRef} className="hidden ul">
              <li className="flex w-32 items-center justify-center border-b-2 border-black py-1">
                <button
                  onClick={() => {
                    this.setState(
                      { sort: SortCriteria.RATING_DES },
                      this.handleChange,
                    );
                  }}
                >
                  Top Rated
                </button>
              </li>
              <li className="flex w-32 items-center justify-center border-b-2 border-black py-1">
                <button
                  onClick={() => {
                    this.setState(
                      { sort: SortCriteria.RATING_ASC },
                      this.handleChange,
                    );
                  }}
                >
                  Worst Rated
                </button>
              </li>
              <li className="flex w-32 items-center justify-center border-b-2 border-black py-1">
                <button
                  onClick={() => {
                    this.setState(
                      { sort: SortCriteria.TIME },
                      this.handleChange,
                    );
                  }}
                >
                  Creation Time
                </button>
              </li>
              <li className="flex w-32 items-center justify-center border-b-2 border-black py-1">
                <button
                  onClick={() => {
                    this.setState(
                      { sort: SortCriteria.COOK_TIME },
                      this.handleChange,
                    );
                  }}
                >
                  Cook Time
                </button>
              </li>
              <li className="flex w-32 items-center justify-center border-b-2 border-black py-1">
                <button
                  onClick={() => {
                    this.setState(
                      { sort: SortCriteria.DIFFICULTY },
                      this.handleChange,
                    );
                  }}
                >
                  Difficulty
                </button>
              </li>
              <li className="flex w-32 items-center justify-center border-b-2 border-black py-1">
                <button
                  onClick={() => {
                    this.setState(
                      { sort: SortCriteria.NAME },
                      this.handleChange,
                    );
                  }}
                >
                  Alphabetically
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center w-full">
          {images}
        </div>
      </>
    );
  }
}
function Search() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    is_logged_in().then((l) => setIsLoggedIn(l));
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
            <SearchList />
          </div>
        </div>
      </div>
      <div className="relative md:hidden flex items-center">
        <img
          className="mt-20 object-cover h-40 w-full"
          src="/foot_mobile.svg"
          alt="Footer"
        />
      </div>
    </>
  );
}
export default Search;
