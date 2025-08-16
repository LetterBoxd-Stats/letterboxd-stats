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

				const response = await axios.get(`${API_BASE_URL}/films`, { params, signal: controller.signal });

				setFilms(response.data.films);
				setTotalPages(response.data.total_pages);
				setTotalFilms(response.data.total_films);
			} catch (err) {
				if (err.name !== "CanceledError") {
					setError(`Failed to fetch films: ...`);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchFilms();
	}, [API_BASE_URL, currentPage, sortBy, sortOrder, activeFilters]);

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
