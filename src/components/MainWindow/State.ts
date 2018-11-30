import {Image} from "../../models/Image";
import {Category} from "../../models/Category";

interface State
{
	category:Category| null;
	resolution:string | null;
	changingSearch:boolean;
	images:Array<Image>;
	loadingMoreImages:boolean;
	downloadingImages:Set<string>;
	allDownloadedImages:Set<string>;
}

type Props = {};

type ReturnValue<T extends keyof State> = Pick<State, T>;
type ReturnValueF<T extends keyof State> =
	(state:Readonly<State>, props:Readonly<Props>)=> Pick<State, T>;

function setCategory(category:Category) : ReturnValueF<'category'>
{
	return (state, props)=>
	{
		return {category:category};
	};
}

function setResolution(resolution:string):ReturnValueF<'resolution'>
{
	return (state, props)=>
	{
		return {resolution:resolution};
	};
}

function setChanging(value:boolean):ReturnValueF<'changingSearch'>
{
	return (state, props) => ({changingSearch:value});

}


function addImages(images: Array<Image> | Image):ReturnValueF<'images'>
{
	return (state, props) =>
	{
		if(images instanceof Array)
		{
			return {images:[...state.images, ...images]};
		}
		else
		{
			return {images:[...state.images, images]};
		}
	};
}

function prepandImages(images:Array<Image>|Image):ReturnValueF<'images'>
{
	return (state, props) =>
	{
		if(images instanceof Array)
		{
			return {images:[...images, ...state.images ]};
		}
		else
		{
			return {images:[images, ...state.images]};
		}
	};
}

function removeFirstImages(n: number):ReturnValueF<'images'>
{
	return (state, props)=>
	{
		const post = state.images.slice(n);
		return {images:post};
	};
}

function removeLastImages(n: number):ReturnValueF<'images'>
{
	return (state, props)=>
	{
		const post = state.images.slice(0, state.images.length - n);
		return {images:post};
	};
}

function clearImages(state:Readonly<State>, props:Readonly<Props>):ReturnValue<'images'>
{
	return {images:[]};
}

function setLoadingImages(value:boolean):ReturnValueF<'loadingMoreImages'>
{
	return (state, props) => ({loadingMoreImages:value});
}


function addToDownloadSet(imgName: string ):ReturnValueF<'downloadingImages'>
{
	return (state, props) =>
	{
		const s:Set<string> = new Set(state.downloadingImages);
		s.add(imgName);
		return {downloadingImages:s};
	};
}

function removeFromDownloadSet(imgName: string)
	:ReturnValueF<'downloadingImages'>
{
	return (state, props) =>
	{
		const s:Set<string> = new Set(state.downloadingImages);
		s.delete(imgName);
		return {downloadingImages:s}
	};
}

function addToAllDownloadedImagesSet(imgName:string):ReturnValueF<'allDownloadedImages'>
{
	return (state, props) =>
	{
		//const s1:Set<string> = new Set(state.allDownloadedImages);
		state.allDownloadedImages.add(imgName);
		return {allDownloadedImages:state.allDownloadedImages};
	};
}

export {State, Props, setCategory, setResolution, setChanging,
	addImages, clearImages, setLoadingImages, addToDownloadSet, removeFromDownloadSet,
	prepandImages, removeFirstImages, removeLastImages, addToAllDownloadedImagesSet};
