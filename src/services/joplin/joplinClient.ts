// TODO: Replace with dynamic port discovery
const port = 41184;

// TODO: Replace with user-provided token
const token = 'foobar';

const baseUrl = `http://localhost:${port}`;

const get = async <T>(path: string, params: Record<string, string> = {}): Promise<T> => {
	const url = new URL(`${baseUrl}${path}`);
	url.searchParams.set('token', token);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}
	const response = await fetch(url.toString());
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Joplin API error ${response.status}: ${body}`);
	}
	return response.json() as Promise<T>;
};

export default { get };
