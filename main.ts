import {BrowserWindow} from 'electron';
import {app, protocol, ipcMain} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import  axios from 'axios';
import {Channels} from "./src/utils/Channels";
import * as Datastore from 'nedb';


let mainWindow : BrowserWindow | null = null;
let db : Datastore | null;

function main()
{
	registerFileProtocol();
	setUpDb();

	mainWindow = new BrowserWindow();
	mainWindow.loadURL("file://build/index.html#/MainWindow");
	mainWindow.show();

}

app.on('ready', main);

ipcMain.on(Channels.downloadImage,(event:any, url:any, name:any)=>
{
	if(!(typeof url === 'string'))
	{
		return;
	}
	if(!(typeof name === 'string'))
	{
		return ;
	}

	axios.get(url,
	{
		responseType:'arraybuffer'
	})
		.then(value =>
		{
			let data:ArrayBuffer = value.data;
			let downloadFolder = app.getPath('downloads');
			fs.writeFileSync(path.join(downloadFolder, name),data);

			const nameIndex = name.lastIndexOf('.');
			event.sender.send(Channels.downloadImage+'Ret', name.substring(0, nameIndex));
		});

	if(db)
	{
		/*Update db to add new image*/
	}

});

ipcMain.on(Channels.loadImagesFromDb, (event:any)=>
{
	if(db)
	{
		const values = db.find({}, {name:1}, (err, d)=>
		{
			if(err)
			{
				console.log(err);
				return ;
			}
			event.sender.send(Channels.loadImagesFromDb+'Ret', d);
		});
	}
});

/**
 * This function intercept file: protocol
 * and resolves requested path based on
 * app path*/
function registerFileProtocol()
{
	protocol.interceptFileProtocol("file", (request, callback)=>
	{
		const protocol = 'file://';
		let url = decodeURIComponent(request.url);
		const hashIndex = url.indexOf("#");
		if(hashIndex !== -1)
		{

			url = url.slice(protocol.length, hashIndex);
		}
		else
		{
			url = url.slice(protocol.length);
		}

		const queryParametersIndex = url.indexOf('?');

		if(queryParametersIndex !== -1)
		{
			url = url.slice(0, queryParametersIndex);
		}

		if(!path.isAbsolute(url))
		{
			url = path.join(app.getAppPath(), url);
		}
		// Build complete path for node require function
		//console.log(url);

		// Replace backslashes by forward slashes (windows)
		// url = url.replace(/\\/g, '/');
		url = path.normalize(url);

		callback(url);
	});

}

function setUpDb()
{
	const appData = app.getPath('userData');

	if(!fs.existsSync(appData))
	{
		fs.mkdirSync(appData);
		console.log(`Did not find appData:${appData}`);
		console.log(`Creating ${appData}`);
	}

	db = new Datastore(path.join(appData, 'db'));
	db.loadDatabase();
	if(!fs.existsSync(path.join(appData, 'db')))
	{
		db.ensureIndex({fieldName:'images.name', unique:true}, (err:Error)=>
		{
			if(err)
			{
				console.log(err);
			}
		});

		db.insert({images:[]}, (err, d)=>
		{
			if(err)
			{
				console.log(err);
			}
		});
	}
}
