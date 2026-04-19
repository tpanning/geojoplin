import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
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

export const availableIcons: IconEntry[] = [
	{ name: 'location-dot', label: 'Pin', definition: faLocationDot },
	{ name: 'star', label: 'Star', definition: faStar },
	{ name: 'heart', label: 'Heart', definition: faHeart },
	{ name: 'flag', label: 'Flag', definition: faFlag },
	{ name: 'bookmark', label: 'Bookmark', definition: faBookmark },
	{ name: 'thumbtack', label: 'Thumbtack', definition: faThumbtack },
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

const iconMap = new Map<string, IconDefinition>(
	availableIcons.map((entry) => [entry.name, entry.definition]),
);

// Returns the SVG path string and viewBox dimensions for a given icon name.
export const getIconSvgPath = (name: string): { width: number; height: number; path: string } => {
	const def = iconMap.get(name) ?? iconMap.get(defaultIconName)!;
	const [width, height, , , path] = def.icon;
	return { width, height, path: Array.isArray(path) ? path[0] : path };
};
