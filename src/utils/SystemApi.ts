import {Image} from "../models/Image";
import {Channels} from "./Channels";
import {WallpaperCraftApi} from "./WallpaperCraftApi";

const ipcRenderer = (window as any).require('electron').ipcRenderer;


function downloadImage(img: Image, resolution: string):void
{
	let api = WallpaperCraftApi.getInstance();
	api.getImageUrl(img, resolution)
		.then(url=>
		{
			const name = `${img.name}.${img.format}`;
			ipcRenderer.send(Channels.downloadImage, url, name);
		})
		.catch(reason => console.log(reason));
	addToDb(img, 'image');
}

function loadImagesFromDb():void
{
	ipcRenderer.send(Channels.loadImagesFromDb);
}

function addToDb(img: Image, type:string)
{
	ipcRenderer.send(Channels.addToDb, img, type);
}

export {downloadImage, loadImagesFromDb, addToDb};