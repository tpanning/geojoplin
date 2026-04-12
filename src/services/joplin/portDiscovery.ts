const minPort = 41184;
const maxPort = 41194;
const expectedResponse = 'JoplinClipperServer';

const pingPort = async (port: number): Promise<boolean> => {
	try {
		const response = await fetch(`http://localhost:${port}/ping`);
		if (!response.ok) return false;
		const text = await response.text();
		return text.trim() === expectedResponse;
	} catch {
		return false;
	}
};

export const discoverPort = async (): Promise<number> => {
	for (let port = minPort; port <= maxPort; port++) {
		if (await pingPort(port)) return port;
	}
	throw new Error(`Joplin Web Clipper service not found on ports ${minPort}–${maxPort}. Make sure Joplin is running and the Web Clipper is enabled.`);
};
