import React, { useState } from 'react';

interface Props {
	onSearch: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
	const [value, setValue] = useState('');

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onSearch(value.trim());
	};

	return (
		<form id="search-bar" onSubmit={handleSubmit}>
			<input
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="Search notes (e.g. tag:geojoplin)"
			/>
			<button type="submit">Search</button>
		</form>
	);
};

export default SearchBar;
