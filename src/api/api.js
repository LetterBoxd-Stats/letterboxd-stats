import axios from "axios";

const BASE_URL = "https://your-api-url.com"; // replace with yours

export const fetchAllRatings = () => axios.get(`${BASE_URL}/ratings`);
export const fetchMovieDetails = (movieId) =>
	axios.get(`${BASE_URL}/movies/${movieId}`);
export const getPredictedRating = (userId, movieId) =>
	axios.post(`${BASE_URL}/predict`, { userId, movieId });
