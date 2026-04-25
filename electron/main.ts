import { app, BrowserWindow, shell, session } from 'electron';
import { join } from 'path';

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		title: 'GeoJoplin',
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	// Intercept any external navigation — open it in the OS default browser/handler
	win.webContents.on('will-navigate', (event, url) => {
		const devServerUrl = process.env['VITE_DEV_SERVER_URL'];
		if (devServerUrl && url.startsWith(devServerUrl)) return;
		if (url.startsWith('file://')) return;
		event.preventDefault();
		void shell.openExternal(url);
	});

	if (process.env['VITE_DEV_SERVER_URL']) {
		void win.loadURL(process.env['VITE_DEV_SERVER_URL']);
	} else {
		void win.loadFile(join(__dirname, '../dist/index.html'));
	}
};

app.whenReady().then(() => {
	// OpenStreetMap tiles require a Referer header, so we add it here for all requests to their tile servers
	session.defaultSession.webRequest.onBeforeSendHeaders(
		{ urls: ['https://*.tile.openstreetmap.org/*'] },
		(details, callback) => {
			details.requestHeaders['Referer'] = 'https://geojoplin.app/';
			callback({ requestHeaders: details.requestHeaders });
		},
	);

	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
}).catch(console.error);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
