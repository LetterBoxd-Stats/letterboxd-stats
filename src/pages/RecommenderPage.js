import React, { useState } from "react";
import { getPredictedRating } from "../api/api";

function RecommenderPage() {
	const [movieId, setMovieId] = useState("");
	const [predictedRating, setPredictedRating] = useState(null);

	const handlePredict = async () => {
		const { data } = await getPredictedRating("sam", movieId); // replace 'sam' with real user ID
		setPredictedRating(data.rating);
	};

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold">Movie Recommender</h1>
			<input
				className="border p-2 mt-4"
				placeholder="Enter movie ID"
				value={movieId}
				onChange={(e) => setMovieId(e.target.value)}
			/>
			<button
				onClick={handlePredict}
				className="ml-2 p-2 bg-blue-500 text-white"
			>
				Predict
			</button>
			{predictedRating !== null && (
				<div className="mt-4 text-xl">
					Predicted Rating: <strong>{predictedRating}</strong>
				</div>
			)}
		</div>
	);
}

export default RecommenderPage;
