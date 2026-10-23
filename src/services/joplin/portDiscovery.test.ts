import discoverPort from './portDiscovery';

const originalFetch = globalThis.fetch;
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

const makeResponse = (ok: boolean, body: string): Response => ({
	ok,
	text: async () => body,
} as Response);

describe('port discovery', () => {
	beforeEach(() => {
		mockFetch.mockReset();
		globalThis.fetch = mockFetch;
	});

	afterAll(() => {
		globalThis.fetch = originalFetch;
	});

	test('returns the first port with the expected successful ping response', async () => {
		mockFetch
			.mockResolvedValueOnce(makeResponse(false, 'JoplinClipperServer'))
			.mockResolvedValueOnce(makeResponse(true, 'Other service'))
			.mockResolvedValueOnce(makeResponse(true, ' JoplinClipperServer\n'));

		await expect(discoverPort()).resolves.toBe(41186);
		expect(mockFetch).toHaveBeenCalledTimes(3);
		expect(mockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:41184/ping');
		expect(mockFetch).toHaveBeenNthCalledWith(2, 'http://localhost:41185/ping');
		expect(mockFetch).toHaveBeenNthCalledWith(3, 'http://localhost:41186/ping');
	});

	test('continues scanning after a network failure', async () => {
		mockFetch
			.mockRejectedValueOnce(new Error('connection refused'))
			.mockResolvedValueOnce(makeResponse(true, 'JoplinClipperServer'));

		await expect(discoverPort()).resolves.toBe(41185);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	test('rejects with setup guidance when no port responds as Joplin', async () => {
		mockFetch.mockResolvedValue(makeResponse(false, 'Unavailable'));

		await expect(discoverPort()).rejects.toThrow(
			'Joplin Web Clipper service not found on ports 41184–41194',
		);
		expect(mockFetch).toHaveBeenCalledTimes(11);
	});
});
