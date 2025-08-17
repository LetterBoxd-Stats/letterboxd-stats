// src/pages/UsersPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/users/UserCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import "./UsersPage.css";

function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const API_BASE_URL = process.env.REACT_APP_API_URL;

	useEffect(() => {
		const controller = new AbortController();
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await axios.get(`${API_BASE_URL}/users`, {
					signal: controller.signal,
				});
				setUsers(response.data);
			} catch (err) {
				if (err.name !== "CanceledError") {
					setError("Failed to fetch users");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
		return () => controller.abort();
	}, [API_BASE_URL]);

	if (loading) return <p className="loading">Loading users...</p>;
	if (error) return <p className="error">{error}</p>;

	const ratingKeys = ["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0"];

	const combinedData = ratingKeys.map((rating) => {
		const entry = { rating };
		users.forEach((user) => {
			entry[user.username] = user.stats?.rating_distribution?.[rating] || 0;
		});
		return entry;
	});

	// --- Overall stats ---
	const totals = users.reduce(
		(acc, user) => {
			acc.num_ratings += user.stats?.num_ratings || 0;
			acc.num_watches += user.stats?.num_watches || 0;
			acc.num_likes += user.stats?.num_likes || 0;
			acc.weighted_sum += (user.stats?.avg_rating || 0) * (user.stats?.num_ratings || 0);
			return acc;
		},
		{ num_ratings: 0, num_watches: 0, num_likes: 0, weighted_sum: 0 }
	);

	const overall = {
		avg_rating: totals.num_ratings ? (totals.weighted_sum / totals.num_ratings).toFixed(2) : "0.00",
		num_ratings: totals.num_ratings,
		num_watches: totals.num_watches,
		num_likes: totals.num_likes,
		like_ratio: totals.num_watches ? ((totals.num_likes / totals.num_watches) * 100).toFixed(1) + "%" : "0%",
	};

	return (
		<div className="users-page">
			<h1>Users</h1>
			<div className="users-grid">
				{users.map((user) => (
					<UserCard key={user.username} user={user} />
				))}
			</div>
			<div className="users-overall-stats">
				<h2>Overall Stats</h2>
				<ul>
					<li>
						<strong>Average Rating:</strong> {overall.avg_rating}
					</li>
					<li>
						<strong>Total Ratings:</strong> {overall.num_ratings}
					</li>
					<li>
						<strong>Total Watches:</strong> {overall.num_watches}
					</li>
					<li>
						<strong>Total Likes:</strong> {overall.num_likes}
					</li>
					<li>
						<strong>Like Ratio:</strong> {overall.like_ratio}
					</li>
				</ul>
			</div>

			<div className="users-distribution-chart">
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={combinedData}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="rating" />
						<YAxis />
						<Tooltip
							formatter={(value, name) => [value, name]}
							contentStyle={{
								backgroundColor: "white",
								border: "1px solid #ccc",
								borderRadius: "8px",
							}}
							itemStyle={{ color: "#333" }}
						/>
						<Legend />
						{users.map((user, idx) => (
							<Bar
								key={user.username}
								dataKey={user.username}
								stackId="a"
								fill={["#932b25", "#82ca9d", "#51355a", "#8d86c9", "#e2cfea", "#216869"][idx % 6]}
							/>
						))}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default UsersPage;
