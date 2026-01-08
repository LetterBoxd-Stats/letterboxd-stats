import React from "react";
import "./FilmSortingControls.css"; // optional for styling

export default function FilmSortingControls({ sortBy, sortOrder, onSortByChange, onSortOrderChange }) {
	return (
		<div className="sorting-controls">
			<label>
				Sort by:{" "}
				<select value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
					<option value="film_title">Title</option>
					<option value="avg_rating">Average Rating</option>
					<option value="num_ratings">Number of Ratings</option>
					<option value="num_watches">Number of Watches</option>
					<option value="num_likes">Number of Likes</option>
					<option value="like_ratio">Like Ratio</option>
					<option value="metadata.avg_rating">Letterboxd Avg Rating</option>
					<option value="metadata.year">Year</option>
					<option value="metadata.runtime">Runtime</option>
				</select>
			</label>

			<label>
				Order:{" "}
				<select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)}>
					<option value="asc">Ascending</option>
					<option value="desc">Descending</option>
				</select>
			</label>
		</div>
	);
}
