import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

	return (
		<div className="users-page">
			<h1>Users</h1>
			<div className="users-grid">
				{users.map((user) => (
					<div key={user.username} className="user-card">
						<h2>{user.username}</h2>
						<div className="user-stats">
							<p>Average Rating: {user.stats.avg_rating}</p>
							<p>Ratings Given: {user.stats.num_ratings}</p>
							<p>Number of Likes: {user.stats.num_likes}</p>
							<p>Like Ratio: {user.stats.like_ratio}</p>
							<p>Films Watched: {user.stats.num_watches}</p>
						</div>
						<Link to={`/users/${user.username}`} className="details-link">
							View Details →
						</Link>
					</div>
				))}
			</div>
		</div>
	);
}

export default UsersPage;
