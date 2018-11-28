import * as React from 'react';

interface State
{
	
}

interface Props
{
	loadNext:()=>void;
	loadPrev:()=>void;
	loading:boolean;
	hasMore:boolean;
	height:number|string;
	loader?:React.ReactNode;
	ender?:React.ReactNode;
}


export {State, Props};