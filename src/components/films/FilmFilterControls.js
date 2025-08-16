import React from "react";
import "./FilmFilterControls.css";

const LETTERBOXD_USERNAMES = process.env.REACT_APP_LETTERBOXD_USERNAMES
	? process.env.REACT_APP_LETTERBOXD_USERNAMES.split(",").map((u) => u.trim())
	: [];

export default function FilmFilterControls({ filters, onChange }) {
	// update a field/operator/value for a filter row
	const handleFilterChange = (index, key, value) => {
		const updated = [...filters];
		updated[index] = { ...updated[index], [key]: value };
		onChange(updated);
	};

	const addFilterRow = () => {
		onChange([...filters, { field: "avg_rating", operator: "gte", value: "" }]);
	};

	const removeFilterRow = (index) => {
		onChange(filters.filter((_, i) => i !== index));
	};

	return (
		<div className="filter-controls">
			<h3>Filters</h3>
			{filters.map((filter, index) => (
				<div key={index} className="filter-row">
					{/* Field selector */}
					<select value={filter.field} onChange={(e) => handleFilterChange(index, "field", e.target.value)}>
						<option value="avg_rating">Average Rating</option>
						<option value="num_ratings">Number of Ratings</option>
						<option value="num_watches">Number of Watches</option>
						<option value="num_likes">Number of Likes</option>
						<option value="like_ratio">Like Ratio</option>
						<option value="watched_by">Watched By</option>
						<option value="not_watched_by">Not Watched By</option>
						<option value="rated_by">Rated By</option>
						<option value="not_rated_by">Not Rated By</option>
					</select>
					;{/* Operator (only for numeric filters) */}
					{!["watched_by", "not_watched_by", "rated_by", "not_rated_by"].includes(filter.field) && (
						<select
							value={filter.operator}
							onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
						>
							<option value="gte">≥</option>
							<option value="lte">≤</option>
						</select>
					)}
					{/* Value input: number for numeric fields, dropdown for watched_by */}
					{["watched_by", "not_watched_by", "rated_by", "not_rated_by"].includes(filter.field) ? (
						<select
							value={filter.value}
							onChange={(e) => handleFilterChange(index, "value", e.target.value)}
						>
							<option value="">Select user</option>
							{LETTERBOXD_USERNAMES.map((username) => (
								<option key={username} value={username}>
									{username}
								</option>
							))}
						</select>
					) : (
						<input
							type="number"
							value={filter.value}
							onChange={(e) => handleFilterChange(index, "value", e.target.value)}
							placeholder="Value"
							className="filter-value-input"
						/>
					)}
					{/* Remove button */}
					<button type="button" className="filter-remove-btn" onClick={() => removeFilterRow(index)}>
						✖
					</button>
				</div>
			))}

			<button type="button" className="filter-add-btn" onClick={addFilterRow}>
				+ Add Filter
			</button>
		</div>
	);
}
