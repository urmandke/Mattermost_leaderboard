import axios from 'axios';
import { AuthCredentials, AuthResponse, ChannelResponse, RowData, UserResponse } from '../models/models';




const API_URL = process.env.REACT_APP_API_URL;

if (!API_URL) {
    throw new Error('REACT_APP_API_URL is not defined in the environment variables');
}

export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        login_id: credentials.login_id,
        password: credentials.password,
      });
      
      console.log(response.headers)
      const token = response.headers['token']; // Assuming the token is in the 'Authorization' header
      if (!token) {
        throw new Error('Token not found in response headers');
      }
  
      return { token };
    } catch (error) {
      console.log(error);
      throw new Error('Login failed');
    }
  };

  export const fetch_data = async (token:string): Promise<RowData[]> => {
    const headers  = {
      'Authorization':`Bearer ${token}`
    }

    try {
      const usersResponse = await axios.get(`${API_URL}/users`, {headers});
      const users:Map<string,string> = new Map(); 
      usersResponse.data.forEach((user:UserResponse)=> {
        users.set(user.id,`${user.email}`);
      })
      const userCounts:Map<string,number> = new Map(); 
      console.log(users);
      const channelsResponse = await axios.get(`${API_URL}/channels`, {headers});
      const channelIds = channelsResponse.data.map((c:ChannelResponse) => {
        return c.id;
      })

      for (const id of channelIds){
        try{
          const postsResponse = await axios.get(`${API_URL}/channels/${id}/posts`, {headers});
          console.log(postsResponse);
          const posts = postsResponse.data.posts;
          for(const post_id of Object.keys(posts)) {
              console.log(posts[post_id].user_id);
              userCounts.set(posts[post_id].user_id,(userCounts.get(posts[post_id].user_id)||0)+1);
              console.log(userCounts.get(posts[post_id].user_id));
          };
        } catch(error) {
          console.log("Error getting post for channel id: ", id, "message: ", error);
          continue
        }
      }

      console.log(userCounts);

      const data:RowData[] = []  
      users.forEach((name,user_id) => {
        console.log(user_id);
        const user_entry:RowData = {
         user: name,
         interactions: userCounts.get(user_id) || 0
        }
        data.push(user_entry);
      });

      return data

    } catch (error) {
        console.log(error);
        throw new Error('Fetching Failed');
    }
  };
  