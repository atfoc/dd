import {Image} from "../../models/Image";

interface State
{
	category:string | null;
	resolution:string | null;
	loading:boolean;
	images:Array<Image>;
}

type Props = {};

type ReturnValue<T extends keyof State> = Pick<State, T>;
type ReturnValueF<T extends keyof State> =
	(state:Readonly<State>, props:Readonly<Props>)=> Pick<State, T>;

function setCategory(category:string) : ReturnValueF<'category'>
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

function setLoading(value:boolean):ReturnValueF<'loading'>
{
	return (state, props) => ({loading:value});

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

export {State, Props, setCategory, setResolution, setLoading, addImages, clearImages};
