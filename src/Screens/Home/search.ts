import axios, { CancelToken } from 'axios';


export interface MoviesListProps {
  id:number;
  name:string;
}
export const searchWithCancelToken = async (query: string, cancelToken?: CancelToken): Promise<MoviesListProps[]> => {
  try {
    const response = await axios.get<{results:MoviesListProps[]}>(`https://api.themoviedb.org/3/search/keyword?api_key=2dca580c2a14b55200e784d157207b4d&query=${query}`, {
      cancelToken: cancelToken
    });
    return response.data.results;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
    } else {
      console.error('Error:', error);
    }
    return []; // or handle error appropriately
  }
};
