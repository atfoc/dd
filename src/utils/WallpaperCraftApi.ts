import {Image} from "../models/Image";
import {parse} from "node-html-parser";
import axios from 'axios';

class WallpaperCraftApi
{
	private static instance_: WallpaperCraftApi | null = null;
	private static baseUrl: string = 'https://wallpaperscraft.com';
	private static baseImgUrl: string = 'https://images.wallpaperscraft.com/image';

	constructor()
	{
	}

	static getInstance(): WallpaperCraftApi
	{
		if (!this.instance_)
		{
			WallpaperCraftApi.instance_ = new WallpaperCraftApi();
			return WallpaperCraftApi.instance_;
		} else
		{
			return WallpaperCraftApi.instance_!;
		}
	}

	async getResolutions(): Promise<Array<string>>
	{

		let response = await axios.get(WallpaperCraftApi.baseUrl);
		let root = parse(response.data);
		let filters = root.querySelectorAll('.filters');
		let resolutions:Array<string> =
			parse(filters[1].toString() as string )
				.querySelectorAll('.filter__link')
				.filter((value :any)=> value.classNames.length === 1)
				.map((value:any)=>value.text.trim())
				.sort((a:string, b:string) =>
				{
					let [a1, a2] = a.split('x')
						.map(value => parseInt(value,10));
					let [b1, b2] = b.split('x')
						.map(value => parseInt(value, 10));

					if(a1 < b1)
					{
						return -1;
					}
					else if(a1 == b1)
					{
						return a2 - b2;
					}
					else
					{
						return 1;
					}
				});
		return resolutions;
	}

	async getCategories(): Promise<Array<string>>
	{
		let response = await axios.get(WallpaperCraftApi.baseUrl);
		let root = parse(response.data);
		let filters = root.querySelectorAll('.filters');
		let categories:Array<string> =
			parse(filters[0].toString() as string )
				.querySelectorAll('.filter__link')
				.filter((value :any)=> value.classNames.length === 1)
				.map((value:any)=>value.childNodes[0].text.trim());

		return categories;
	}

	async getImages(resolution: string, category: string = 'all', page: number = 1):
		Promise<Array<Image>>
	{
		category = category === 'all' ? category :
			`catalog/${category.toLowerCase().replace(' ', '_')}`;
		let response = await axios.get(
			`${WallpaperCraftApi.baseUrl}/${category}/${resolution}/page${page}`);
		let root = parse(response.data);
		let images = root.querySelectorAll('img.wallpapers__image')
			.map((value) =>
			{
				let src: string = (value as any).attributes.src;
				let name = src.substring(src.lastIndexOf('/')+1, src.lastIndexOf('_'));
				let type = src.substr(src.lastIndexOf('.')+1);
				return new Image(name, type);
			});

		return images;

	}

	async getImageThumbnailUrl(img: Image): Promise<string>
	{
		return	`${WallpaperCraftApi.baseImgUrl}/${img.name}_300x168.${img.format}`;
	}

	getImageUrl(img: Image, resolution: string): string
	{
		return '';
	}
}

export {WallpaperCraftApi};