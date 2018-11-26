import {Image} from "../../models/Image";

interface State
{
	imgUrl:string;
}

interface Props
{
	image:Image;
	onImageDownload:()=>void;
}

type ReturnF<T extends keyof  State> =
	(state:Readonly<State>, props:Readonly<Props>)=>Pick<State, T>;

function setImgUrl(imgUrl:string):ReturnF<'imgUrl'>
{
	return (state, props) =>
	{
		return {imgUrl:imgUrl};
	};
}

export {State, Props, setImgUrl}