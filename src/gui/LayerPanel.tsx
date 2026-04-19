import React, { useState } from 'react';
import { NoteLayer } from '../services/joplin/types';

interface Props {
	layers: NoteLayer[];
	onLayersChange: (layers: NoteLayer[]) => void;
}

let nextId = 1;

const presetColors = [
	'#3b82f6', // blue
	'#ef4444', // red
	'#22c55e', // green
	'#f59e0b', // amber
	'#a855f7', // purple
	'#ec4899', // pink
	'#14b8a6', // teal
	'#f97316', // orange
];

const LayerPanel: React.FC<Props> = ({ layers, onLayersChange }) => {
	const [expanded, setExpanded] = useState(false);

	const addLayer = () => {
		const color = presetColors[layers.length % presetColors.length];
		onLayersChange([...layers, { id: String(nextId++), query: '', color }]);
		setExpanded(true);
	};

	const removeLayer = (id: string) => {
		onLayersChange(layers.filter((layer) => layer.id !== id));
	};

	const updateLayer = (id: string, updates: Partial<NoteLayer>) => {
		onLayersChange(layers.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)));
	};

	return (
		<div className="layer-panel">
			<div className="layer-panel-header">
				<button type="button" className="layer-toggle" onClick={() => setExpanded(!expanded)}>
					{expanded ? '▾' : '▸'} Layers ({layers.length || 'all notes'})
				</button>
				<button type="button" className="layer-add" onClick={addLayer}>+ Add layer</button>
			</div>
			{expanded && (
				<div className="layer-list">
					{layers.length === 0 && (
						<div className="layer-hint">No layers defined — showing all geotagged notes with the default style.</div>
					)}
					{layers.map((layer) => (
						<div key={layer.id} className="layer-row">
							<input
								type="color"
								value={layer.color}
								onChange={(e) => updateLayer(layer.id, { color: e.target.value })}
								className="layer-color"
								title="Marker color"
							/>
							<input
								type="text"
								value={layer.query}
								onChange={(e) => updateLayer(layer.id, { query: e.target.value })}
								placeholder="Search query (e.g. tag:campsite)"
								className="layer-query"
							/>
							<button type="button" className="layer-remove" onClick={() => removeLayer(layer.id)} title="Remove layer">✕</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default LayerPanel;
