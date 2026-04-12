import React, { useState } from 'react';

interface Props {
	onConfirm: (token: string) => void;
}

const TokenDialog: React.FC<Props> = ({ onConfirm }) => {
	const [value, setValue] = useState('');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const trimmed = value.trim();
		if (trimmed) onConfirm(trimmed);
	};

	return (
		<div className="token-dialog-overlay">
			<div className="token-dialog">
				<h2>Connect to Joplin</h2>
				<p>
					Enter your Web Clipper authorisation token. You can find it in
					Joplin under <strong>Tools &gt; Options &gt; Web Clipper</strong>.
				</p>
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						placeholder="Paste your token here"
						autoFocus
					/>
					<button type="submit" disabled={!value.trim()}>Connect</button>
				</form>
			</div>
		</div>
	);
};

export default TokenDialog;
