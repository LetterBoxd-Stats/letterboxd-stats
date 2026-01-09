// RecommenderPage.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./RecommenderPage.css";

function RecommenderPage() {
	// Get users from environment variable
	const users = process.env.REACT_APP_LETTERBOXD_USERNAMES
		? process.env.REACT_APP_LETTERBOXD_USERNAMES.split(",").map((u) => u.trim())
		: [];

	// Get genres from environment variable
	const allGenres = process.env.REACT_APP_LETTERBOXD_GENRES
		? process.env.REACT_APP_LETTERBOXD_GENRES.split(",").map((g) => g.trim())
		: [];

	// State for users
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [availableWatchers, setAvailableWatchers] = useState("");
	const [maxOkToHaveWatched, setMaxOkToHaveWatched] = useState(0);

	// State for filters
	const [numRecs, setNumRecs] = useState(5);

	// Numeric filters
	const [avgRatingMin, setAvgRatingMin] = useState("");
	const [avgRatingMax, setAvgRatingMax] = useState("");
	const [yearMin, setYearMin] = useState("");
	const [yearMax, setYearMax] = useState("");
	const [runtimeMin, setRuntimeMin] = useState("");
	const [runtimeMax, setRuntimeMax] = useState("");

	// Text filters
	const [directors, setDirectors] = useState("");
	const [actors, setActors] = useState("");
	const [studios, setStudios] = useState("");
	const [themes, setThemes] = useState("");
	const [description, setDescription] = useState("");
	const [crew, setCrew] = useState("");
	const [selectedGenres, setSelectedGenres] = useState([]);

	// Results
	const [recommendations, setRecommendations] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [hasSearched, setHasSearched] = useState(false);

	const API_BASE_URL = process.env.REACT_APP_API_URL;

	// Handle user selection
	const toggleUserSelection = (username) => {
		if (selectedUsers.includes(username)) {
			setSelectedUsers(selectedUsers.filter((user) => user !== username));
		} else {
			if (selectedUsers.length === 0) {
				setSelectedUsers([username]);
			} else {
				setSelectedUsers([...selectedUsers, username]);
			}
		}
	};

	// Handle available watchers selection
	const handleAvailableWatchersChange = (e) => {
		setAvailableWatchers(e.target.value);
	};

	// Handle max ok to have watched
	const handleMaxOkChange = (e) => {
		const value = parseInt(e.target.value);
		setMaxOkToHaveWatched(isNaN(value) ? 0 : value);
	};

	// Handle genre selection
	const toggleGenre = (genre) => {
		if (selectedGenres.includes(genre)) {
			setSelectedGenres(selectedGenres.filter((g) => g !== genre));
		} else {
			setSelectedGenres([...selectedGenres, genre]);
		}
	};

	// Reset all filters
	const resetFilters = () => {
		setSelectedUsers([]);
		setNumRecs(5);
		setAvgRatingMin("");
		setAvgRatingMax("");
		setYearMin("");
		setYearMax("");
		setRuntimeMin("");
		setRuntimeMax("");
		setDirectors("");
		setActors("");
		setStudios("");
		setThemes("");
		setDescription("");
		setCrew("");
		setSelectedGenres([]);
		setAvailableWatchers("");
		setMaxOkToHaveWatched(0);
		setRecommendations([]);
		setHasSearched(false);
		setError(null);
	};

	// Fetch recommendations
	const fetchRecommendations = async () => {
		if (selectedUsers.length === 0) {
			setError("Please select at least one user");
			return;
		}

		setLoading(true);
		setError(null);
		setHasSearched(true);

		try {
			const params = {
				watchers: selectedUsers.join(","),
				num_recs: Math.min(numRecs, 20), // Cap at 20 as requested
			};

			// Add optional filters if they have values
			if (availableWatchers) params.ok_to_have_watched = availableWatchers;
			if (maxOkToHaveWatched > 0) params.max_ok_to_have_watched = maxOkToHaveWatched;

			// Numeric filters
			if (avgRatingMin) params["metadata.avg_rating_gte"] = parseFloat(avgRatingMin);
			if (avgRatingMax) params["metadata.avg_rating_lte"] = parseFloat(avgRatingMax);
			if (yearMin) params["metadata.year_gte"] = parseInt(yearMin);
			if (yearMax) params["metadata.year_lte"] = parseInt(yearMax);
			if (runtimeMin) params["metadata.runtime_gte"] = parseInt(runtimeMin);
			if (runtimeMax) params["metadata.runtime_lte"] = parseInt(runtimeMax);

			// Text filters
			if (directors) params.directors = directors;
			if (actors) params.actors = actors;
			if (studios) params.studios = studios;
			if (themes) params.themes = themes;
			if (description) params.description = description;
			if (crew) params.crew = crew;
			if (selectedGenres.length > 0) params.genres = selectedGenres.join(",");

			const response = await axios.get(`${API_BASE_URL}/recommendations`, { params });

			setRecommendations(response.data.recommendations || []);
		} catch (err) {
			setError(`Failed to fetch recommendations: ${err.response?.data?.message || err.message}`);
			setRecommendations([]);
		} finally {
			setLoading(false);
		}
	};

	// Format rating to stars or number
	const formatRating = (rating) => {
		if (!rating) return "N/A";
		return rating.toFixed(2);
	};

	return (
		<div className="recommender-page">
			<h1>Film Recommender</h1>

			{/* User Selection Section */}
			<div className="user-selection">
				<h3>Select Users for Recommendations</h3>
				<p className="user-selection-info">Choose one or more users to generate recommendations for:</p>

				<div className="user-list">
					{users.map((user) => (
						<div
							key={user}
							className={`user-checkbox ${selectedUsers.includes(user) ? "selected" : ""}`}
							onClick={() => toggleUserSelection(user)}
						>
							<input type="checkbox" checked={selectedUsers.includes(user)} onChange={() => {}} />
							{user}
						</div>
					))}
				</div>

				{selectedUsers.length > 0 && (
					<p style={{ color: "#ccc", marginBottom: "1rem" }}>
						Selected: <strong>{selectedUsers.join(", ")}</strong>
					</p>
				)}

				<div className="user-selection-controls">
					<div className="filter-group">
						<label>Users who can have already watched (optional):</label>
						<select
							className="watchers-select"
							value={availableWatchers}
							onChange={handleAvailableWatchersChange}
							disabled={selectedUsers.length === 0}
						>
							<option value="">Select users who can have already watched</option>
							<option value="all">Allow all selected users to have watched</option>
							{selectedUsers.map((user) => (
								<option key={user} value={user}>
									{user}
								</option>
							))}
						</select>
					</div>

					<div className="filter-group">
						<label>Max number of selected users who can have watched:</label>
						<input
							type="number"
							className="filter-input"
							min="0"
							max={selectedUsers.length}
							value={maxOkToHaveWatched}
							onChange={handleMaxOkChange}
							disabled={selectedUsers.length === 0}
						/>
					</div>
				</div>
			</div>

			{/* Filters Section */}
			<div className="filters-section">
				<h3>Filters</h3>

				<div className="filter-row">
					<div className="filter-group">
						<label>Number of recommendations (max 20):</label>
						<input
							type="number"
							className="filter-input"
							min="1"
							max="20"
							value={numRecs}
							onChange={(e) => setNumRecs(Math.min(parseInt(e.target.value) || 1, 20))}
						/>
					</div>

					<div className="filter-group">
						<label>Average Letterboxd Rating:</label>
						<div className="numeric-filter">
							<input
								type="number"
								className="filter-input"
								min="0"
								max="5"
								step="0.1"
								placeholder="Min"
								value={avgRatingMin}
								onChange={(e) => setAvgRatingMin(e.target.value)}
							/>
							<span>to</span>
							<input
								type="number"
								className="filter-input"
								min="0"
								max="5"
								step="0.1"
								placeholder="Max"
								value={avgRatingMax}
								onChange={(e) => setAvgRatingMax(e.target.value)}
							/>
							<span className="filter-unit">stars</span>
						</div>
					</div>
				</div>

				<div className="filter-row">
					<div className="filter-group">
						<label>Release Year:</label>
						<div className="numeric-filter">
							<input
								type="number"
								className="filter-input"
								min="1900"
								max="2025"
								placeholder="Min"
								value={yearMin}
								onChange={(e) => setYearMin(e.target.value)}
							/>
							<span>to</span>
							<input
								type="number"
								className="filter-input"
								min="1900"
								max="2025"
								placeholder="Max"
								value={yearMax}
								onChange={(e) => setYearMax(e.target.value)}
							/>
						</div>
					</div>

					<div className="filter-group">
						<label>Runtime (minutes):</label>
						<div className="numeric-filter">
							<input
								type="number"
								className="filter-input"
								min="1"
								max="400"
								placeholder="Min"
								value={runtimeMin}
								onChange={(e) => setRuntimeMin(e.target.value)}
							/>
							<span>to</span>
							<input
								type="number"
								className="filter-input"
								min="1"
								max="400"
								placeholder="Max"
								value={runtimeMax}
								onChange={(e) => setRuntimeMax(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="filter-row">
					<div className="filter-group">
						<label>Genres:</label>
						<div className="genre-selection">
							<div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
								{allGenres.map((genre) => (
									<div
										key={genre}
										className={`user-checkbox ${selectedGenres.includes(genre) ? "selected" : ""}`}
										onClick={() => toggleGenre(genre)}
										style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem" }}
									>
										<input
											type="checkbox"
											checked={selectedGenres.includes(genre)}
											onChange={() => {}}
										/>
										{genre}
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="filter-group">
						<label>Description keywords (comma-separated):</label>
						<input
							type="text"
							className="filter-input"
							placeholder="e.g., space,mission"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</div>

				<div className="filter-row">
					<div className="filter-group">
						<label>Directors (comma-separated):</label>
						<input
							type="text"
							className="filter-input"
							placeholder="e.g., Nolan,Christopher"
							value={directors}
							onChange={(e) => setDirectors(e.target.value)}
						/>
					</div>

					<div className="filter-group">
						<label>Actors (comma-separated):</label>
						<input
							type="text"
							className="filter-input"
							placeholder="e.g., DiCaprio,Hawke"
							value={actors}
							onChange={(e) => setActors(e.target.value)}
						/>
					</div>
				</div>

				<div className="filter-row">
					<div className="filter-group">
						<label>Studios (comma-separated):</label>
						<input
							type="text"
							className="filter-input"
							placeholder="e.g., Warner,Universal"
							value={studios}
							onChange={(e) => setStudios(e.target.value)}
						/>
					</div>

					<div className="filter-group">
						<label>Themes (comma-separated):</label>
						<input
							type="text"
							className="filter-input"
							placeholder="e.g., Noir,Romance"
							value={themes}
							onChange={(e) => setThemes(e.target.value)}
						/>
					</div>
				</div>

				<div className="filter-row">
					<div className="filter-group">
						<label>Crew (comma-separated):</label>
						<input
							type="text"
							className="filter-input"
							placeholder="e.g., Johnny"
							value={crew}
							onChange={(e) => setCrew(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="action-buttons">
				<button
					className="action-btn"
					onClick={fetchRecommendations}
					disabled={selectedUsers.length === 0 || loading}
				>
					{loading ? "Getting Recommendations..." : "Get Recommendations"}
				</button>
				<button className="action-btn secondary" onClick={resetFilters}>
					Reset Filters
				</button>
			</div>

			{/* Error Display */}
			{error && <div className="error">{error}</div>}

			{/* Results Section */}
			{hasSearched && (
				<div className="recommendation-results">
					<h2>Recommendations {recommendations.length > 0 && `(${recommendations.length} found)`}</h2>

					{loading ? (
						<div className="loading">Loading recommendations...</div>
					) : recommendations.length === 0 ? (
						<div className="no-results">
							No recommendations found. Try adjusting your filters or selecting different users.
						</div>
					) : (
						<div className="recommendations-list">
							{recommendations.map((film, index) => (
								<div key={film.film_id || index} className="recommendation-card">
									<div className="recommendation-header">
										<div className="recommendation-title-row">
											<h3 className="recommendation-title">
												{film.film_title}
												<span className="recommendation-year">({film.metadata?.year})</span>
											</h3>
											<div className="recommendation-meta">
												<span>Letterboxd: {formatRating(film.metadata?.avg_rating)}</span>
												<span>•</span>
												<span>{film.metadata?.runtime} min</span>
											</div>
										</div>
										{film.metadata?.directors?.length > 0 && (
											<div className="recommendation-directors">
												Directed by {film.metadata.directors.join(", ")}
											</div>
										)}
									</div>

									<div className="recommendation-content">
										{film.metadata?.description && (
											<p className="recommendation-description">{film.metadata.description}</p>
										)}

										<div className="recommendation-stats">
											<div className="stat-group">
												<h4>Predicted Ratings</h4>
												<div className="predicted-ratings">
													{film.predicted_reviews &&
														Object.entries(film.predicted_reviews).map(([user, review]) => (
															<div
																key={user}
																className={`predicted-rating ${
																	review.rating >= 3.5 ? "high" : ""
																}`}
															>
																<strong>{user}:</strong> {formatRating(review.rating)}
																{review.is_liked && " ❤️"}
															</div>
														))}
												</div>
											</div>

											<div className="stat-group">
												<h4>Current Status</h4>
												<div className="watches-list">
													{film.reviews?.map((review) => (
														<div
															key={`${review.user}`}
															className={`watch-status rated ${
																review.is_liked ? "liked" : ""
															}`}
														>
															{review.user}: {`${formatRating(review.rating)}`}
															{review.is_liked && " ❤️"}
														</div>
													))}
													{film.watches?.map((watch) => (
														<div
															key={`${watch.user}`}
															className={`watch-status watched ${
																watch.rating ? "rated" : ""
															}`}
														>
															{watch.user}: N/A
															{watch.is_liked && " ❤️"}
														</div>
													))}
												</div>
											</div>
										</div>

										<div className="recommendation-links">
											<Link to={`/films/${film.film_id}`} className="recommendation-link">
												View Details
											</Link>
											<a
												href={
													film.film_link?.startsWith("http")
														? film.film_link
														: `https://${film.film_link}`
												}
												target="_blank"
												rel="noopener noreferrer"
												className="recommendation-link"
											>
												View on Letterboxd
											</a>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default RecommenderPage;
