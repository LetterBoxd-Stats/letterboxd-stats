import React, { useState } from "react";
import "./Pagination.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
	const [pageInput, setPageInput] = useState(String(currentPage));

	const handlePrev = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
			setPageInput(String(currentPage - 1));
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
			setPageInput(String(currentPage + 1));
		}
	};

	const handleInputChange = (e) => {
		setPageInput(e.target.value);
	};

	const handleInputKeyDown = (e) => {
		if (e.key === "Enter") {
			let value = parseInt(pageInput, 10);
			if (isNaN(value) || value < 1) value = 1;
			else if (value > totalPages) value = totalPages;
			onPageChange(value);
			setPageInput(String(value));
		}
	};

	return (
		<div className="pagination">
			<button onClick={handlePrev} disabled={currentPage === 1}>
				Previous
			</button>

			<span>
				Page{" "}
				<input
					type="number"
					className="pagination-input"
					value={pageInput}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
				/>{" "}
				of {totalPages}
			</span>

			<button onClick={handleNext} disabled={currentPage === totalPages}>
				Next
			</button>
		</div>
	);
}
