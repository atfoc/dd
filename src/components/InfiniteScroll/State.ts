import * as React from 'react';

interface State
{
	
}

interface Props
{
	loadNext:()=>void;
	loadPrev:()=>void;
	loading:boolean;
	hasNext:boolean;
	hasPrev:boolean;
	height:number|string;
	loader?:React.ReactNode;
	ender?:React.ReactNode;
	numberOfLoadedPages:number;
}


export {State, Props};