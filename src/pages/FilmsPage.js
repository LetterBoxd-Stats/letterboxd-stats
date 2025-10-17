import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilmsPage.css";
import FilmFilterControls from "../components/films/FilmFilterControls";
import FilmSortingControls from "../components/films/FilmSortingControls";
import FilmList from "../components/films/FilmList";
import Pagination from "../components/Pagination";

function FilmsPage() {
	const [films, setFilms] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalFilms, setTotalFilms] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
	console.log(API_BASE_URL)
	useEffect(() => {
		const controller = new AbortController();
		const fetchFilms = async () => {
			setLoading(true);
			try {
				const params = {
					page: currentPage,
					limit: FILMS_PER_PAGE,
					sort_by: sortBy,
					sort_order: sortOrder,
				};

				// Group filters by type to handle multiple values for the same field
				const textSearchFilters = {};
				const userFilters = {};
				const numericFilters = {};

				// Organize filters by type
				activeFilters.forEach((filter) => {
					if (filter.value !== "") {
						// User-based filters (watched_by, rated_by, etc.)
						if (["watched_by", "not_watched_by", "rated_by", "not_rated_by"].includes(filter.field)) {
							if (userFilters[filter.field]) {
								userFilters[filter.field].push(filter.value);
							} else {
								userFilters[filter.field] = [filter.value];
							}
						}
						// Text search filters (genres, directors, actors, etc.)
						else if (
							["genres", "directors", "actors", "studios", "themes", "description", "crew"].includes(
								filter.field
							)
						) {
							if (textSearchFilters[filter.field]) {
								textSearchFilters[filter.field].push(filter.value);
							} else {
								textSearchFilters[filter.field] = [filter.value];
							}
						}
						// Numeric filters with operators
						else {
							const paramName = `${filter.field}_${filter.operator}`;
							if (numericFilters[paramName]) {
								// For multiple numeric filters on same field, take the more restrictive value
								if (filter.operator === "gte") {
									numericFilters[paramName] = Math.max(
										numericFilters[paramName],
										parseFloat(filter.value)
									);
								} else if (filter.operator === "lte") {
									numericFilters[paramName] = Math.min(
										numericFilters[paramName],
										parseFloat(filter.value)
									);
								}
							} else {
								if (filter.field === "like_ratio") {
									numericFilters[paramName] = parseFloat(filter.value) / 100;
								} else {
									numericFilters[paramName] = parseFloat(filter.value);
								}
							}
						}
					}
				});

				// Apply user filters (comma-separated values)
				Object.keys(userFilters).forEach((field) => {
					params[field] = userFilters[field].join(",");
				});

				// Apply text search filters (comma-separated values)
				Object.keys(textSearchFilters).forEach((field) => {
					params[field] = textSearchFilters[field].join(",");
				});

				// Apply numeric filters
				Object.keys(numericFilters).forEach((paramName) => {
					params[paramName] = numericFilters[paramName];
				});

				const response = await axios.get(`${API_BASE_URL}/films`, { params, signal: controller.signal });

				setFilms(response.data.films);
				setTotalPages(response.data.total_pages);
				setTotalFilms(response.data.total_films);
			} catch (err) {
				if (err.name !== "CanceledError") {
					setError(`Failed to fetch films: ${err.message}`);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchFilms();
	}, [API_BASE_URL, currentPage, sortBy, sortOrder, activeFilters, FILMS_PER_PAGE]);

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
			<div className="sorting-filter-controls">
				<FilmSortingControls
					sortBy={pendingSortBy}
					sortOrder={pendingSortOrder}
					onSortByChange={setPendingSortBy}
					onSortOrderChange={setPendingSortOrder}
				/>

				{/* Filters */}
				<FilmFilterControls filters={pendingFilters} onChange={setPendingFilters} />

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

			<FilmList films={films} />

			<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
		</div>
	);
}

export default FilmsPage;
