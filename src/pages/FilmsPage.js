import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilmsPage.css";

function FilmsPage() {
	const [films, setFilms] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageInput, setPageInput] = useState("1"); // New state for input box
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

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
				setPageInput(String(currentPage)); // Sync input with confirmed page
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

	const nextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage((prev) => prev + 1);
		}
	};

	const prevPage = () => {
		if (currentPage > 1) {
			setCurrentPage((prev) => prev - 1);
		}
	};

	const handlePageInputChange = (e) => {
		setPageInput(e.target.value); // Just update the input state
	};

	const handlePageInputKeyDown = (e) => {
		if (e.key === "Enter") {
			let value = parseInt(pageInput, 10);
			if (isNaN(value) || value < 1) {
				value = 1;
			} else if (value > totalPages) {
				value = totalPages;
			}
			setCurrentPage(value); // Confirm and trigger fetch
		}
	};

	if (loading) return <p className="loading">Loading films...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		<div className="films-page">
			<h1>Films</h1>
			<ul className="films-list">
				{films.map((film) => (
					<li key={film.film_id}>
						<a
							href={`${film.film_link}`}
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
				<span>
					Page{" "}
					<input
						type="number"
						value={pageInput}
						onChange={handlePageInputChange}
						onKeyDown={handlePageInputKeyDown}
						style={{ width: "60px", textAlign: "center" }}
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
