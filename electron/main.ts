import { app, BrowserWindow, shell } from 'electron';
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

	// Intercept joplin:// deep links — open them via the OS rather than navigating
	win.webContents.on('will-navigate', (event, url) => {
		if (url.startsWith('joplin://')) {
			event.preventDefault();
			void shell.openExternal(url);
		}
	});

	if (process.env['VITE_DEV_SERVER_URL']) {
		void win.loadURL(process.env['VITE_DEV_SERVER_URL']);
	} else {
		void win.loadFile(join(__dirname, '../dist/index.html'));
	}
};

app.whenReady().then(() => {
	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
}).catch(console.error);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
