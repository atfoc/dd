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

function removeFromDownloadSet(imgName: string):ReturnValueF<'downloadingImages'>
{
	return (state, props) =>
	{
		const s:Set<string> = new Set(state.downloadingImages);
		s.delete(imgName);
		return {downloadingImages:s}
	};
}

export {State, Props, setCategory, setResolution, setChanging,
	addImages, clearImages, setLoadingImages, addToDownloadSet, removeFromDownloadSet};
