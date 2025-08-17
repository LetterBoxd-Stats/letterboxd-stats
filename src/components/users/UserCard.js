// src/components/UserCard.js
import React from "react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./UserCard.css"; // optional for styling

function UserCard({ user }) {
	// Convert rating_distribution object → array
	const ratingData = Object.entries(user.stats.rating_distribution || {}).map(([rating, count]) => ({
		rating,
		count,
	}));

	return (
		<div className="user-card">
			<h2>{user.username}</h2>
			<div className="user-stats">
				<p>Average Rating: {user.stats.avg_rating.toFixed(3)}</p>
				<p>Ratings Given: {user.stats.num_ratings}</p>
				<p>Number of Likes: {user.stats.num_likes}</p>
				<p>Like Ratio: {user.stats.like_ratio.toFixed(3)}</p>
				<p>Films Watched: {user.stats.num_watches}</p>
			</div>

			{/* Bar chart */}
			<div className="user-chart">
				<ResponsiveContainer>
					<div>
						<BarChart width={250} height={175} data={ratingData}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis dataKey="rating" axisLine={true} />
							<YAxis axisLine={true} />
							<Tooltip
								formatter={(value) => [value]}
								labelFormatter={() => ""}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #ccc",
									borderRadius: "8px",
								}}
								itemStyle={{
									color: "#333", // dark gray / black text
									fontSize: "0.9rem",
								}}
							/>
							<Bar dataKey="count" fill="#82ca9d" />
						</BarChart>
					</div>
				</ResponsiveContainer>
			</div>

			<Link to={`/users/${user.username}`} className="details-link">
				View Details →
			</Link>
		</div>
	);
}

export default UserCard;
