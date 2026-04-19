import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import iconFamiliesMetaRaw from '@fortawesome/fontawesome-free/metadata/icon-families.json';
import {
	faLocationDot,
	faTent,
	faHouse,
	faStar,
	faFlag,
	faTree,
	faMountain,
	faUtensils,
	faBed,
	faCamera,
	faLandmark,
	faCampground,
	faChurch,
	faStore,
	faFish,
	faBicycle,
	faCar,
	faPlane,
	faAnchor,
	faHeart,
	faBookmark,
	faCircleInfo,
	faMapPin,
	faThumbtack,
} from '@fortawesome/free-solid-svg-icons';

export interface IconEntry {
	name: string;
	label: string;
	definition: IconDefinition;
}

// Pin-style icons: rendered as-is, anchored at center-bottom
export const pinIconNames = new Set<string>(['location-dot', 'thumbtack']);

export const availableIcons: IconEntry[] = [
	{ name: 'location-dot', label: 'Pin', definition: faLocationDot },
	{ name: 'thumbtack', label: 'Thumbtack', definition: faThumbtack },
	{ name: 'star', label: 'Star', definition: faStar },
	{ name: 'heart', label: 'Heart', definition: faHeart },
	{ name: 'flag', label: 'Flag', definition: faFlag },
	{ name: 'bookmark', label: 'Bookmark', definition: faBookmark },
	{ name: 'map-pin', label: 'Map pin', definition: faMapPin },
	{ name: 'circle-info', label: 'Info', definition: faCircleInfo },
	{ name: 'house', label: 'House', definition: faHouse },
	{ name: 'tent', label: 'Tent', definition: faTent },
	{ name: 'campground', label: 'Campground', definition: faCampground },
	{ name: 'tree', label: 'Tree', definition: faTree },
	{ name: 'mountain', label: 'Mountain', definition: faMountain },
	{ name: 'church', label: 'Church', definition: faChurch },
	{ name: 'landmark', label: 'Landmark', definition: faLandmark },
	{ name: 'store', label: 'Store', definition: faStore },
	{ name: 'utensils', label: 'Food', definition: faUtensils },
	{ name: 'bed', label: 'Lodging', definition: faBed },
	{ name: 'camera', label: 'Camera', definition: faCamera },
	{ name: 'fish', label: 'Fishing', definition: faFish },
	{ name: 'bicycle', label: 'Bicycle', definition: faBicycle },
	{ name: 'car', label: 'Car', definition: faCar },
	{ name: 'plane', label: 'Plane', definition: faPlane },
	{ name: 'anchor', label: 'Anchor', definition: faAnchor },
];

export const defaultIconName = 'location-dot';

interface IconFamilyMeta {
	label?: string;
	search?: { terms?: string[] };
}

const iconFamiliesMeta = iconFamiliesMetaRaw as Record<string, IconFamilyMeta>;

const labelFromName = (name: string): string =>
	name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

// Full map of every FA solid icon, used by getIconSvgPath and search.
const allIconsMap = new Map<string, IconDefinition>(
	(Object.values(fas) as IconDefinition[])
		.filter(def => def && typeof def.iconName === 'string')
		.map(def => [def.iconName, def]),
);

// Sorted array of all solid icons for search results.
const allIconsList: IconEntry[] = [...allIconsMap.entries()]
	.map(([name, definition]) => {
		const meta = iconFamiliesMeta[name];
		return {
			name,
			label: meta?.label ?? labelFromName(name),
			definition,
		};
	})
	.sort((a, b) => a.name.localeCompare(b.name));

export const searchIcons = (query: string, limit = 48): IconEntry[] => {
	const q = query.toLowerCase().trim();
	return allIconsList.filter(e => {
		if (e.name.includes(q) || e.label.toLowerCase().includes(q)) return true;
		const terms = iconFamiliesMeta[e.name]?.search?.terms;
		return terms ? terms.some(t => t.includes(q)) : false;
	}).slice(0, limit);
};

// Returns the SVG path string and viewBox dimensions for a given icon name.
export const getIconSvgPath = (name: string): { width: number; height: number; path: string } => {
	const def = allIconsMap.get(name) ?? allIconsMap.get(defaultIconName)!;
	const [width, height, , , path] = def.icon;
	return { width, height, path: Array.isArray(path) ? path[0] : path };
};
