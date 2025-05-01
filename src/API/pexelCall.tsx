import axios from 'axios';

export const pexelCall = axios.create({
  baseURL: 'https://api.pexels.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_PEXEL_API_KEY}`,
  },
});
