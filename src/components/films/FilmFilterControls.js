import React from "react";
import "./FilmFilterControls.css";

const LETTERBOXD_USERNAMES = process.env.REACT_APP_LETTERBOXD_USERNAMES
	? process.env.REACT_APP_LETTERBOXD_USERNAMES.split(",").map((u) => u.trim())
	: [];

const LETTERBOXD_GENRES = process.env.REACT_APP_LETTERBOXD_GENRES
	? process.env.REACT_APP_LETTERBOXD_GENRES.split(",").map((u)=>u.trim())
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

	// Check if field is numeric (uses operators)
	const isNumericField = (field) => {
		const numericFields = [
			"avg_rating",
			"num_ratings",
			"num_watches",
			"num_likes",
			"like_ratio",
			"metadata.avg_rating",
			"metadata.year",
			"metadata.runtime",
		];
		return numericFields.includes(field);
	};

	// Check if field is a user filter (uses dropdown)
	const isUserField = (field) => {
		const userFields = ["watched_by", "not_watched_by", "rated_by", "not_rated_by"];
		return userFields.includes(field);
	};

	// Check if field is genre filter (use dropdown)
	const isGenreField = (field) => {
		const genreField = ["genres"];
		return genreField.includes(field)
	}

	// Check if field is a text search field (free text input)
	const isTextSearchField = (field) => {
		const textSearchFields = ["directors", "actors", "studios", "themes", "description", "crew"];
		return textSearchFields.includes(field);
	};

	// Get placeholder text for text search fields
	const getTextSearchPlaceholder = (field) => {
		const placeholders = {
			directors: "e.g., Christopher Nolan, Quentin Tarantino",
			actors: "e.g., Tom Hanks, Meryl Streep",
			studios: "e.g., Warner Bros, A24",
			themes: "e.g., Time Travel, Coming of Age",
			description: "Search in descriptions...",
			crew: "e.g., Cinematographer, Composer",
			genres: "e.g., Horror, Comedy, Science Fiction",
		};
		return placeholders[field] || `Search ${field}...`;
	};

	return (
		<div className="filter-controls">
			<h3>Filters</h3>
			{filters.map((filter, index) => (
				<div key={index} className="filter-row">
					{/* Field selector */}
					<select value={filter.field} onChange={(e) => handleFilterChange(index, "field", e.target.value)}>
						{/* Numeric fields */}
						<optgroup label="Numeric Fields">
							<option value="avg_rating">Average Rating</option>
							<option value="num_ratings">Number of Ratings</option>
							<option value="num_watches">Number of Watches</option>
							<option value="num_likes">Number of Likes</option>
							<option value="like_ratio">Like Ratio</option>
							<option value="metadata.avg_rating">Letterboxd Avg Rating</option>
							<option value="metadata.year">Year</option>
							<option value="metadata.runtime">Runtime (minutes)</option>
						</optgroup>

						{/* User-based filters */}
						<optgroup label="User Activity">
							<option value="watched_by">Watched By</option>
							<option value="not_watched_by">Not Watched By</option>
							<option value="rated_by">Rated By</option>
							<option value="not_rated_by">Not Rated By</option>
						</optgroup>

						{/* genre filter */}
						<optgroup label="Genre">
							<option value="genres">Genre</option>
						</optgroup>

						{/* Text search filters */}
						<optgroup label="Text Search">
							<option value="directors">Director</option>
							<option value="actors">Actor</option>
							<option value="studios">Studio</option>
							<option value="themes">Theme</option>
							<option value="description">Description</option>
							<option value="crew">Crew</option>
						</optgroup>
					</select>

					{/* Operator (only for numeric filters) */}
					{isNumericField(filter.field) && (
						<select
							value={filter.operator}
							onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
						>
							<option value="gte">≥</option>
							<option value="lte">≤</option>
						</select>
					)}

					{/* Value input based on field type */}
					{isUserField(filter.field) ? (
						// User dropdown for user-based filters
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
					) : isGenreField(filter.field) ? (
						// User dropdown for genre filters
						<select
							value={filter.value}
							onChange={(e) => handleFilterChange(index, "value", e.target.value)}
						>
							<option value="">Select genre</option>
							{LETTERBOXD_GENRES.map((genre) => (
								<option key={genre} value={genre}>
									{genre}
								</option>
							))}
						</select>
					) : isNumericField(filter.field) ? (
						// Number input for numeric fields
						<input
							type="number"
							value={filter.value}
							onChange={(e) => handleFilterChange(index, "value", e.target.value)}
							placeholder="Value"
							className="filter-value-input"
							step={filter.field.includes("rating") ? "0.1" : "1"}
							min="0"
						/>
					) : isTextSearchField(filter.field) ? (
						// Text input for text search fields
						<input
							type="text"
							value={filter.value}
							onChange={(e) => handleFilterChange(index, "value", e.target.value)}
							placeholder={getTextSearchPlaceholder(filter.field)}
							className="filter-value-input"
						/>
					) : null}

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
