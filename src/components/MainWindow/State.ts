interface State
{
	category:string | null;
	resolution:string | null;
	loading:boolean;
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

function toggleLoading(state:Readonly<State>, props:Readonly<Props>):ReturnValue<'loading'>
{
	return {loading:!state.loading};
}


export {State, Props, setCategory, setResolution, toggleLoading};
