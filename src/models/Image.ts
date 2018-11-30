
class Image
{
	readonly name:string;
	readonly format:string;
	constructor(name:string, format:string)
	{
		this.name = name;
		this.format = format;
	}
}

function isImage(obj:any):obj is Image
{
	return isImageLike(obj) && obj instanceof Image;
}

function isImageLike(obj: any):obj is {[K in keyof Image]:Image[K]}
{
	if(obj.name && typeof(obj.name) !== 'string')
	{
		return false;
	}
	if(obj.format && typeof(obj.format) !== 'string')
	{
		return false;
	}
	return true;
}
export {Image, isImage, isImageLike};