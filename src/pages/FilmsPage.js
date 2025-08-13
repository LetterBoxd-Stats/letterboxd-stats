import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilmsPage.css";
import { getStarsFromRating } from "../utils/helpers";

function FilmsPage() {
	const [films, setFilms] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageInput, setPageInput] = useState("1");
	const [totalPages, setTotalPages] = useState(1);
	const [totalFilms, setTotalFilms] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedFilmIds, setExpandedFilmIds] = useState(new Set());

	// Filters
	const [pendingFilters, setPendingFilters] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);

	// Sorting (pending vs applied)
	const [sortBy, setSortBy] = useState("film_title");
	const [sortOrder, setSortOrder] = useState("asc");
	const [pendingSortBy, setPendingSortBy] = useState(sortBy);
	const [pendingSortOrder, setPendingSortOrder] = useState(sortOrder);

	const FILMS_PER_PAGE = process.env.REACT_APP_FILMS_PER_PAGE || 20;
	const API_BASE_URL = process.env.REACT_APP_API_URL;
	const LETTERBOXD_USERNAMES = process.env.REACT_APP_LETTERBOXD_USERNAMES
		? process.env.REACT_APP_LETTERBOXD_USERNAMES.split(",").map((u) => u.trim())
		: [];

	useEffect(() => {
		const fetchFilms = async () => {
			try {
				const params = {
					page: currentPage,
					limit: FILMS_PER_PAGE,
					sort_by: sortBy,
					sort_order: sortOrder,
				};

				activeFilters.forEach((filter) => {
					if (filter.value !== "") {
						// Filter watched by
						if (filter.field === "watched_by") {
							if (params["watched_by"]) {
								params["watched_by"] += `,${filter.value}`;
							} else {
								params["watched_by"] = filter.value;
							}
						}
						// Filter other fields
						else {
							let param_name = `${filter.field}_${filter.operator}`;
							// If the same filter is applied multiple times, take the more restrictive value
							if (params[param_name]) {
								if (filter.operator === "gte") {
									params[param_name] = Math.max(params[param_name], filter.value);
								} else if (filter.operator === "lte") {
									params[param_name] = Math.min(params[param_name], filter.value);
								}
							}
							// Otherwise, set the filter value
							else {
								if (filter.field === "like_ratio") {
									params[param_name] = parseFloat(filter.value) / 100;
								} else {
									params[param_name] = filter.value;
								}
							}
						}
					}
				});

				const response = await axios.get(`${API_BASE_URL}/films`, { params });

				setFilms(response.data.films);
				setTotalPages(response.data.total_pages);
				setTotalFilms(response.data.total_films);
				setPageInput(String(currentPage));
			} catch (err) {
				setError(`Failed to fetch films: ${err.response ? err.response.data.message : err.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchFilms();
	}, [API_BASE_URL, currentPage, sortBy, sortOrder, activeFilters]);

	const toggleExpand = (filmId) => {
		setExpandedFilmIds((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(filmId)) {
				newSet.delete(filmId);
			} else {
				newSet.add(filmId);
			}
			return newSet;
		});
	};

	const nextPage = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	const handlePageInputChange = (e) => {
		setPageInput(e.target.value);
	};

	const handlePageInputKeyDown = (e) => {
		if (e.key === "Enter") {
			let value = parseInt(pageInput, 10);
			if (isNaN(value) || value < 1) value = 1;
			else if (value > totalPages) value = totalPages;
			setCurrentPage(value);
		}
	};

	// Pending controls update handlers
	const handlePendingSortByChange = (e) => {
		setPendingSortBy(e.target.value);
	};

	const handlePendingSortOrderChange = (e) => {
		setPendingSortOrder(e.target.value);
	};

	const handleFilterChange = (index, key, value) => {
		setPendingFilters((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [key]: value };
			return updated;
		});
	};

	const addFilterRow = () => {
		setPendingFilters((prev) => [...prev, { field: "avg_rating", operator: "gte", value: "" }]);
	};

	const removeFilterRow = (index) => {
		setPendingFilters((prev) => prev.filter((_, i) => i !== index));
	};

	const applySortAndFilters = () => {
		setSortBy(pendingSortBy);
		setSortOrder(pendingSortOrder);
		setActiveFilters(pendingFilters);
		setCurrentPage(1);
	};

	if (loading) return <p className="loading">Loading films...</p>;
	if (error) return <p className="error">{error}</p>;

	const startIndex = (currentPage - 1) * FILMS_PER_PAGE + 1;
	const endIndex = Math.min(currentPage * FILMS_PER_PAGE, totalFilms);

	return (
		<div className="films-page">
			<h1>Films</h1>

			{/* Sorting controls */}
			<div className="sorting-controls">
				<label>
					Sort by:
					<select value={pendingSortBy} onChange={handlePendingSortByChange}>
						<option value="film_title">Title</option>
						<option value="avg_rating">Average Rating</option>
						<option value="num_ratings">Number of Ratings</option>
						<option value="num_watches">Number of Watches</option>
						<option value="num_likes">Number of Likes</option>
						<option value="like_ratio">Like Ratio</option>
					</select>
				</label>
				<label>
					Order:
					<select value={pendingSortOrder} onChange={handlePendingSortOrderChange}>
						<option value="asc">Ascending</option>
						<option value="desc">Descending</option>
					</select>
				</label>

				{/* Filters */}
				<div className="filter-controls">
					<h3>Filters</h3>
					{pendingFilters.map((filter, index) => (
						<div key={index} className="filter-row">
							<select
								value={filter.field}
								onChange={(e) => handleFilterChange(index, "field", e.target.value)}
							>
								<option value="avg_rating">Average Rating</option>
								<option value="num_ratings">Number of Ratings</option>
								<option value="num_watches">Number of Watches</option>
								<option value="num_likes">Number of Likes</option>
								<option value="like_ratio">Like Ratio</option>
								<option value="watched_by">Watched By</option>
							</select>
							{filter.field !== "watched_by" && (
								<select
									value={filter.operator}
									onChange={(e) => handleFilterChange(index, "operator", e.target.value)}
								>
									<option value="gte">≥</option>
									<option value="lte">≤</option>
								</select>
							)}
							{filter.field === "watched_by" ? (
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

							<button type="button" className="filter-remove-btn" onClick={() => removeFilterRow(index)}>
								✖
							</button>
						</div>
					))}
					<button type="button" className="filter-add-btn" onClick={addFilterRow}>
						+ Add Filter
					</button>
				</div>

				<button type="button" className="apply-btn" onClick={applySortAndFilters}>
					Apply
				</button>
			</div>

			<div className="pagination-info">
				{totalFilms > 0 && (
					<p>
						Showing {startIndex} - {endIndex} of {totalFilms} results
					</p>
				)}
			</div>

			<ul className="films-list">
				{films.map((film) => {
					const isExpanded = expandedFilmIds.has(film.film_id);
					return (
						<li key={film.film_id} className="film-item">
							<div
								className={`film-header clickable ${isExpanded ? "expanded" : ""}`}
								onClick={() => toggleExpand(film.film_id)}
							>
								<span className="film-title">{film.film_title}</span>
								<div className="film-stats-summary">
									<span>⭐ {film.avg_rating != null ? film.avg_rating.toFixed(2) : "N/A"}</span>
									<span>({film.num_ratings != null ? film.num_ratings : 0} ratings)</span>
									<span className={`expand-arrow ${isExpanded ? "expanded" : ""}`}>▼</span>
								</div>
							</div>

							<div className={`film-details ${isExpanded ? "expanded" : ""}`}>
								<p>❤️ Likes: {film.num_likes != null ? film.num_likes : 0}</p>
								<p>
									🎯 Like Ratio:{" "}
									{film.like_ratio != null ? `${(film.like_ratio * 100).toFixed(1)}%` : "N/A"}
								</p>
								<p>👀 Watches: {film.num_watches != null ? film.num_watches : 0}</p>
								<p>
									🔗{" "}
									<a
										href={
											film.film_link.startsWith("http")
												? film.film_link
												: `https://${film.film_link}`
										}
										target="_blank"
										rel="noopener noreferrer"
									>
										View on Letterboxd
									</a>
								</p>
								<div className={`user-info ${isExpanded ? "expanded" : ""}`}>
									<h4>Viewers</h4>
									{film.reviews.map((review) => (
										<div key={review.user + "-" + film.film_id} className="review">
											<p className="user-review">
												{review.user}:{" "}
												<span className="star-rating">{getStarsFromRating(review.rating)}</span>
												{review.is_liked && " ❤️"}
											</p>
										</div>
									))}
									{film.watches.map((watch) => (
										<div key={watch.user + "-" + film.film_id} className="review">
											<p className="user-review">
												{watch.user}: <span className="star-rating">N/A</span>
												{watch.is_liked && " ❤️"}
											</p>
										</div>
									))}
								</div>
							</div>
						</li>
					);
				})}
			</ul>

			<div className="pagination">
				<button onClick={prevPage} disabled={currentPage === 1}>
					Previous
				</button>
				<span>
					Page{" "}
					<input
						type="number"
						className="pagination-input"
						value={pageInput}
						onChange={handlePageInputChange}
						onKeyDown={handlePageInputKeyDown}
					/>{" "}
					of {totalPages}
				</span>
				<button onClick={nextPage} disabled={currentPage === totalPages}>
					Next
				</button>
			</div>
		</div>
	);
}

export default FilmsPage;
