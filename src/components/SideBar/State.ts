import {Category} from "../../models/Category";

interface State
{
	opened:boolean;
	categories:Array<Category>;
	resolutions:Array<string>;
}

interface Props
{
	resolution:string | null;
	category:Category| null;
	onResolutionChange: (resolution: string)=>void;
	onCategoryChange: (category:Category|(()=>Category))=>void;
}

type ReturnValue<T extends keyof State> = Pick<State, T>
type ReturnValueF<T extends keyof State> =
	(state:Readonly<State>, props:Readonly<Props>)=>Pick<State,T>

function toggleSideBar(state:Readonly<State>, props:Readonly<Props>):ReturnValue<'opened'>
{
	return {opened:!state.opened};
}

function setCategories(categories:Array<Category>):ReturnValueF<'categories'>
{
	return (state, props) => ({categories:categories});
}

function setResolutions(resolutions:Array<string>):ReturnValueF<'resolutions'>
{
	return (state, props) => ({resolutions:resolutions});
}

export {State, Props, toggleSideBar, setCategories, setResolutions};
