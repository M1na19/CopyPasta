import axios from "axios";

export interface Recipe {
  uuid: string;
  name: string;
  rating:number|null
  images: string[] | null; 
  users: {
    username: string;
  };
  types: {
    name: string;
  };
  cookingTime: number | null;
  difficulty: number | null; 
  description: string | null;
  uploadTime: Date; 
}

export function request(url: string, req_type: string, body?: any): Promise<any> {
    return axios({
      url: url,
      method: req_type,
      data: body, // Correct property for the request body
    })
      .then((res) => {
        return res.data; // This value is passed to the caller
      })
      .catch((e) => {
        console.error(e);
        throw e; // Ensure the caller can handle the error
      });
  }
  