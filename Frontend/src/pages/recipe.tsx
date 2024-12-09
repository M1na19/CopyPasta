import React, { createRef, useEffect, useState } from "react";
import { Recipe, request, Review } from "../requests";
import { StarBuilder } from "./modules";
import Cookies from "js-cookie";
import { is_logged_in } from "../requests";

class RecipePopUp extends React.Component<{
  uuid: string | null;
  reseter: () => void;
}> {
  state = {
    recipe: null as Recipe | null,
    reviews: [] as Review[],
    rating_given: 0 as number,
    isLoggedIn: false,
    isOnList: false,
  };
  componentDidMount() {
    request(
      `http://localhost:8000/recipe_data?uuid=${this.props.uuid}`,
      "GET",
    ).then((data) => {
      const rec = data.recipe as Recipe;
      this.setState({ recipe: rec });
    });
    request(
      `http://localhost:8000/reviews?uuid=${this.props.uuid}`,
      "GET",
    ).then((data) => {
      const reviews = data.reviews as Review[];
      this.setState({ reviews: reviews });
    });
    is_logged_in().then((l) => {
      this.setState({ isLoggedIn: l });
      request("http://localhost:8000/list", "GET").then((data) => {
        const list = data.list as Recipe[];
        const result = list.find((value) => {
          return value.uuid == this.state.recipe?.uuid;
        });
        if (result != undefined) {
          this.setState({ isOnList: true });
        }
      });
    });
  }
  render(): React.ReactNode {
    const rec = this.state.recipe;
    const p_image = rec
      ? rec.images
        ? rec.images[0]
        : "/images/basic.webp"
      : "/images/basic.webp";
    const images = rec?.images?.slice(1);

    const popup_ref = createRef<HTMLDivElement>();

    const starRef = createRef<HTMLDivElement>();
    const commentRef = createRef<HTMLTextAreaElement>();
    document.body.style.overflow = "hidden";
    return (
      <>
        <div
          ref={popup_ref}
          className="fixed top-0 left-0 h-full w-full flex flex-col bg-gray-100 z-[100] overflow-y-auto"
        >
          <div className="w-full flex mt-4">
            <button
              className="ml-auto mr-4"
              onClick={() => {
                this.props.reseter();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-between w-full sm:px-32 py-10">
            <div className="flex flex-wrap justify-center">
              <img src={p_image} className="h-80 max-w-60 object-cover"></img>
              <div className="flex flex-col ml-10">
                <div className="flex justify-start w-full">
                  <b className="text-3xl">{rec?.name}</b>
                </div>
                <div className="w-40 mt-5">
                  <StarBuilder num_stars={rec?.rating || 0} />
                </div>
                <div className="flex flex-col items-start w-full mt-10">
                  <b className="text-xl">Author:</b>
                  <p className="text-xl">{rec?.users.username}</p>
                </div>
                <div className="flex flex-col items-start w-full mt-10">
                  <p>
                    Cooking Time:{" "}
                    {rec?.cookingTime
                      ? rec?.cookingTime + " min"
                      : "Not specified"}
                  </p>
                  <p>
                    Difficulty:{" "}
                    {rec?.difficulty ? rec?.difficulty + "/5" : "Not specified"}
                  </p>
                  <p>Type: {rec?.types.name}</p>
                  <p>Upload Time: {rec?.uploadTime.toLocaleString()}</p>
                </div>
              </div>
            </div>
            {this.state.isLoggedIn ? (
              <div className="flex flex-col w-min-[1000px]:ml-auto mt-10">
                <b className="w-full flex justify-center text-2xl">
                  Rate this recipe
                </b>
                <div
                  className="mt-5 flex justify-center w-auto"
                  ref={starRef}
                  onClick={(
                    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                  ) => {
                    if (starRef) {
                      const rect =
                        starRef.current!.children[0].getBoundingClientRect();
                      if (
                        e.clientX > rect.left &&
                        e.clientX < rect.left + rect.width + 20
                      ) {
                        const x = e.clientX - rect.left;
                        let rating_given = x / (rect.width / 5);
                        rating_given = Math.min(
                          Math.floor(rating_given / 0.5) * 0.5,
                          5,
                        );

                        this.setState({ rating_given: rating_given }, () => {
                          console.log(this.state.rating_given);
                        });
                      }
                    }
                  }}
                >
                  <StarBuilder num_stars={this.state.rating_given} />
                </div>
                <textarea
                  ref={commentRef}
                  className="mt-5"
                  placeholder="Leave a comment"
                ></textarea>
                <button
                  className="mt-5 bg-green-300 text-center rounded-xl py-1 w-20 ml-auto"
                  onClick={() => {
                    if (commentRef.current) {
                      const comment = commentRef.current.value;
                      commentRef.current.value = ""; // Clear the input immediately
                      request("http://localhost:8000/rate_recipe", "POST", {
                        uuid: rec?.uuid,
                        rating: this.state.rating_given,
                        comment: comment,
                      })
                        .then(() => {
                          this.setState({ rating_given: 0 });
                          this.componentDidMount();
                        })
                        .catch((err) => {
                          console.error("Failed to submit rating:", err);
                        });
                    } else {
                      console.error("Comment input is not available.");
                    }
                  }}
                >
                  Submit
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col px-10">
            <b className="text-2xl text-green-500 w-full border-b-2 border-b-green-500">
              Description
            </b>
            <p>{rec?.description}</p>
          </div>
          <div className="flex flex-wrap px-10  justify-center sm:justify-between">
            {images ? (
              images.map((image, idx) => {
                return (
                  <img key={idx} src={image} className="w-60 max-h-60"></img>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col px-10 mt-10">
            <b className="text-2xl text-red-500 w-full border-b-2 border-b-red-500">
              Reviews
            </b>
            {this.state.reviews.map((rev) => {
              return (
                <>
                  <div className="w-full bg-blue-300 rounded-xl px-5 py-5 mt-10">
                    <div className="flex flex-col items-start w-full mt-10">
                      <p className="text-2xl">{rev.users.username}</p>
                      <p className="text-xl">
                        {rev.uploadTime.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-10">
                      <StarBuilder num_stars={rev.rating} />
                    </div>
                    <p className="w-full flex justify-start">{rev.comment}</p>
                  </div>
                </>
              );
            })}
          </div>
          {this.state.isLoggedIn && !this.state.isOnList ? (
            <div className="w-full flex items-center justify-center mt-10">
              <button
                className="bg-green-400 text-white px-5 py-1 rounded-xl"
                onClick={() => {
                  request("http://localhost:8000/add_to_list", "POST", {
                    uuid: rec?.uuid,
                  }).then(() => {
                    this.componentDidMount();
                  });
                }}
              >
                Add to my list
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}
export default RecipePopUp;
