import React from "react";
import "./NotFoundPage.css";

function NotFoundPage() {
	return (
		<div className="not-found-page">
			<div className="not-found-container">
				<h1 className="not-found-title">404</h1>
				<h2 className="not-found-subtitle">Page Not Found</h2>
				<p className="not-found-message">The page you're looking for doesn't exist or has been moved.</p>
				<div className="not-found-actions">
					<button className="not-found-button" onClick={() => window.history.back()}>
						← Go Back
					</button>
					<button className="not-found-button primary" onClick={() => (window.location.href = "/")}>
						Go Home
					</button>
				</div>
			</div>
		</div>
	);
}

export default NotFoundPage;
