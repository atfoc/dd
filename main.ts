import {BrowserWindow} from 'electron';
import {app} from 'electron';

let mainWindow : BrowserWindow | null = null;

function main()
{
	mainWindow = new BrowserWindow();
	mainWindow.show();
}

app.on('ready', main);
