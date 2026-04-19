import React, { useState } from 'react';
import { NoteLayer } from '../services/joplin/types';
import { availableIcons, defaultIconName, getIconSvgPath } from '../services/map/icons';

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

const iconPreviewSvg = (iconName: string, fill: string, size = 16) => {
	const { width, height, path } = getIconSvgPath(iconName);
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} width={size} height={size}>
			<path d={path} fill={fill} />
		</svg>
	);
};

interface IconPickerProps {
	value: string;
	color: string;
	onChange: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, color, onChange }) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="layer-icon-picker">
			<button
				type="button"
				className="layer-icon-button"
				onClick={() => setOpen(!open)}
				title="Choose icon"
			>
				{iconPreviewSvg(value, color, 14)}
			</button>
			{open && (
				<div className="layer-icon-grid">
					{availableIcons.map((entry) => (
						<button
							key={entry.name}
							type="button"
							className={`layer-icon-option${entry.name === value ? ' selected' : ''}`}
							title={entry.label}
							onClick={() => { onChange(entry.name); setOpen(false); }}
						>
							{iconPreviewSvg(entry.name, entry.name === value ? color : '#666', 16)}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

const LayerPanel: React.FC<Props> = ({ layers, onLayersChange }) => {
	const [expanded, setExpanded] = useState(false);

	const addLayer = () => {
		const color = presetColors[layers.length % presetColors.length];
		onLayersChange([...layers, { id: String(nextId++), query: '', color, icon: defaultIconName }]);
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
							<IconPicker
								value={layer.icon}
								color={layer.color}
								onChange={(icon) => updateLayer(layer.id, { icon })}
							/>
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
