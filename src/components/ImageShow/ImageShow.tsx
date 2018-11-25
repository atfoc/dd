import * as React from 'react';
import {State, Props} from "./State";
import {setImgUrl} from './State';
import {WallpaperCraftApi} from '../../utils/WallpaperCraftApi';

class ImageShow extends React.Component<Props, State>
{
	private api:WallpaperCraftApi;
	constructor(props:Props)
	{
		super(props);

		this.state =
			{
				imgUrl: ''
			};

		this.api = WallpaperCraftApi.getInstance();

	}

	componentDidUpdate(prevProps: Readonly<Props>): void
	{
		/*Careful this may be multiple rerender because of async nature of react*/
		if(prevProps.image !== this.props.image || this.state.imgUrl === '')
		{
			this.api.getImageThumbnailUrl(this.props.image)
				.then(value => this.setState(setImgUrl(value)))
				.catch(reason => console.log(reason));

		}
	}

	render(): React.ReactNode
	{
		if(this.state.imgUrl === '')
		{
			return null;
		}

		return (
			<img src={this.state.imgUrl}/>
		);
	}
}

export {ImageShow};