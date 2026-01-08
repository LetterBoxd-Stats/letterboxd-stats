import React from "react";
import "./ComingSoon.css";

function ComingSoon({ pageName }) {
	return (
		<div className="comingsoon">
			<h1>{pageName} – Coming Soon 🚧</h1>
			<p>We’re working hard to bring you this feature. Stay tuned!</p>
		</div>
	);
}

export default ComingSoon;
