import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilmsPage.css";

function FilmsPage() {
	const [films, setFilms] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const FILMS_PER_PAGE = 20;
	const API_BASE_URL = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const fetchFilms = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${API_BASE_URL}/films`);
				setFilms(response.data);
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
	}, [API_BASE_URL]);

	const startIndex = (currentPage - 1) * FILMS_PER_PAGE;
	const currentFilms = films.slice(startIndex, startIndex + FILMS_PER_PAGE);

	const nextPage = () => {
		if (startIndex + FILMS_PER_PAGE < films.length) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	if (loading) return <p className="loading">Loading films...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		<div className="films-page">
			<h1>Films</h1>
			<ul className="films-list">
				{currentFilms.map((film) => (
					<li key={film.film_id}>
						<a
							href={film.film_link}
							target="_blank"
							rel="noopener noreferrer"
						>
							{film.film_title}
						</a>
					</li>
				))}
			</ul>
			<div className="pagination">
				<button onClick={prevPage} disabled={currentPage === 1}>
					Previous
				</button>
				<span>Page {currentPage}</span>
				<button
					onClick={nextPage}
					disabled={startIndex + FILMS_PER_PAGE >= films.length}
				>
					Next
				</button>
			</div>
		</div>
	);
}

export default FilmsPage;
