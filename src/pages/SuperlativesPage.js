import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SuperlativesPage.css";

function SuperlativesPage() {
	const [superlatives, setSuperlatives] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [openCategories, setOpenCategories] = useState({
		"User Superlatives": true,
		"Film Superlatives": true,
		"Genre Superlatives": true,
		"Genre Preference Superlatives": true,
	});

	const API_BASE_URL = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const fetchSuperlatives = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${API_BASE_URL}/superlatives`);
				setSuperlatives(response.data);
			} catch (err) {
				setError(`Failed to fetch superlatives: ${err.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchSuperlatives();
	}, [API_BASE_URL]);

	const formatValue = (value, superlativeName) => {
		if (value === null || value === undefined) return "";

		// Handle comparative stats - add + for positive values
		if (
			superlativeName.includes("Comparative") ||
			superlativeName.includes("Enthusiast") ||
			superlativeName.includes("Critic")
		) {
			return `(${value >= 0 ? "+" : ""}${value.toFixed(2)})`;
		}

		// Handle BFFs/Enemies - show as decimal
		if (superlativeName === "BFFs" || superlativeName === "Enemies") {
			return `(${value.toFixed(2)})`;
		}

		// Handle rating values (0.5-5.0 scale)
		if (
			superlativeName.includes("Positive") ||
			superlativeName.includes("Negative") ||
			superlativeName.includes("Best Movie") ||
			superlativeName.includes("Worst Movie") ||
			superlativeName.includes("Genre")
		) {
			return `(${value.toFixed(2)})`;
		}

		// Handle count values
		if (Number.isInteger(value)) {
			return `(${value})`;
		}

		// Handle all other decimal values as decimals (no percentages)
		return `(${value.toFixed(2)})`;
	};

	const renderWinners = (superlative) => {
		const winners = [];

		if (superlative.first && superlative.first.length > 0) {
			winners.push({
				label: "🥇 First Place",
				winners: superlative.first,
				value: superlative.first_value,
			});
		}

		if (superlative.second && superlative.second.length > 0) {
			winners.push({
				label: "🥈 Second Place",
				winners: superlative.second,
				value: superlative.second_value,
			});
		}

		if (superlative.third && superlative.third.length > 0) {
			winners.push({
				label: "🥉 Third Place",
				winners: superlative.third,
				value: superlative.third_value,
			});
		}

		if (winners.length === 0) {
			return <div className="empty-winners">No winners for this category</div>;
		}

		return winners.map((group, index) => (
			<div key={index} className="winner-group">
				<span className="winner-label">{group.label}</span>
				<ul className="winner-list">
					{group.winners.map((winner, winnerIndex) => (
						<li key={winnerIndex} className="winner-item">
							{winner}
							{group.value !== null && group.value !== undefined && (
								<span className="winner-value">{formatValue(group.value, superlative.name)}</span>
							)}
						</li>
					))}
				</ul>
			</div>
		));
	};

	const toggleCategory = (category) => {
		setOpenCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	const renderCategory = (category) => {
		const isOpen = openCategories[category.category];

		return (
			<div key={category._id} className="category-card">
				<div className="category-header" onClick={() => toggleCategory(category.category)}>
					<h2 className="category-title">{category.category}</h2>
					<div className={`triangle ${isOpen ? "open" : ""}`} />
				</div>
				<div className={`category-content ${isOpen ? "open" : ""}`}>
					<div className="superlatives-grid">
						{category.superlatives.map((superlative, index) => (
							<div key={index} className="superlative-card">
								<div className="superlative-header">
									<h3 className="superlative-name">{superlative.name}</h3>
									<p className="superlative-description">{superlative.description}</p>
								</div>
								<div className="winners-section">{renderWinners(superlative)}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	};

	if (loading)
		return (
			<div className="superlatives-page">
				<p className="loading">Loading superlatives...</p>
			</div>
		);
	if (error)
		return (
			<div className="superlatives-page">
				<p className="error">{error}</p>
			</div>
		);

	return (
		<div className="superlatives-page">
			<h1>Superlatives</h1>
			{superlatives.map(renderCategory)}
		</div>
	);
}

export default SuperlativesPage;
