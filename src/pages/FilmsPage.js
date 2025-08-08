import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilmsPage.css";

function FilmsPage() {
	const [films, setFilms] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageInput, setPageInput] = useState("1");
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [expandedFilmIds, setExpandedFilmIds] = useState(new Set());

	const FILMS_PER_PAGE = 20;
	const API_BASE_URL = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const fetchFilms = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await axios.get(`${API_BASE_URL}/films`, {
					params: { page: currentPage, limit: FILMS_PER_PAGE },
				});

				setFilms(response.data.films);
				setTotalPages(response.data.total_pages);
				setPageInput(String(currentPage));
			} catch (err) {
				setError(
					`Failed to fetch films: ${
						err.response ? err.response.data.message : err.message
					}`
				);
			} finally {
				setLoading(false);
			}
		};

		fetchFilms();
	}, [API_BASE_URL, currentPage]);

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

	if (loading) return <p className="loading">Loading films...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		<div className="films-page">
			<h1>Films</h1>
			<ul className="films-list">
				{films.map((film) => {
					const isExpanded = expandedFilmIds.has(film.film_id);
					return (
						<li key={film.film_id} className="film-item">
							<div
								className={`film-header clickable ${
									isExpanded ? "expanded" : ""
								}`}
								onClick={() => toggleExpand(film.film_id)}
							>
								<span className="film-title">
									{film.film_title}
								</span>
								<div className="film-stats-summary">
									<span>
										⭐{" "}
										{film.avg_rating != null
											? film.avg_rating.toFixed(2)
											: "N/A"}
									</span>
									<span>
										(
										{film.num_ratings != null
											? film.num_ratings
											: 0}{" "}
										ratings)
									</span>
									<span className="expand-arrow">▼</span>
								</div>
							</div>

							<div
								className={`film-details ${
									isExpanded ? "expanded" : ""
								}`}
							>
								<p>
									👍 Likes:{" "}
									{film.num_likes != null
										? film.num_likes
										: 0}
								</p>
								<p>
									🎯 Like Ratio:{" "}
									{film.like_ratio != null
										? `${(film.like_ratio * 100).toFixed(
												1
										  )}%`
										: "N/A"}
								</p>
								<p>
									👀 Watches:{" "}
									{film.num_watches != null
										? film.num_watches
										: 0}
								</p>
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
				<button
					onClick={nextPage}
					disabled={currentPage === totalPages}
				>
					Next
				</button>
			</div>
		</div>
	);
}

export default FilmsPage;
