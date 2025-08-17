// src/pages/UserDetailPage.js
import React from "react";
import { useParams } from "react-router-dom";

function UserDetailPage() {
	const { username } = useParams();

	return (
		<div className="users-page">
			<h1>{username}</h1>
			<p>More detailed stats will go here...</p>
		</div>
	);
}

export default UserDetailPage;
