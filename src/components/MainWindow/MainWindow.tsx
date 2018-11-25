import './style.css';
import * as React from 'react';
import {State, Props} from './State';
import {setCategory, setResolution, setLoading, addImages, clearImages} from './State';
import {WallpaperCraftApi} from '../../utils/WallpaperCraftApi';

import {Col, Container, Row} from "reactstrap";
import {SideBar} from "../SideBar/SideBar";
import {ImageShow} from '../ImageShow/ImageShow';

import {Image} from "../../models/Image";

class MainWindow extends React.Component<Props, State>
{

	private api:WallpaperCraftApi;
	private onReloadImages:()=>void;

	constructor(props:Props)
	{
		super(props);

		this.state =
			{
				category:null,
				resolution:null,
				loading:false,
				images:[]
			};

		this.api = WallpaperCraftApi.getInstance();

		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onResolutionChange = this.onResolutionChange.bind(this);
		this.onImagesRecived = this.onImagesRecived.bind(this);
		this.onReloadImages = this.onGetMoreImages.bind(this, 1);
	}



	/*View code*/
	onGetMoreImages(page:number)
	{
		if(this.state.resolution && this.state.category)
		{
			this.api.getImages(this.state.resolution, this.state.category, page)
				.then(this.onImagesRecived)
				.catch(reason =>
				{
					console.log(reason);
					this.setState(setLoading(false));
				});
		}
	}

	onCategoryChange(category: string):void
	{
		this.setState(setCategory(category));
		this.setState(setLoading(true));
		this.setState(clearImages, this.onReloadImages);
	}

	onResolutionChange(resolution:string):void
	{
		this.setState(setResolution(resolution));
		this.setState(setLoading(true));
		this.setState(clearImages, this.onReloadImages);

	}

	onImagesRecived(images:Array<Image>):void
	{
		this.setState(addImages(images));
		this.setState(setLoading(false));
	}

	/*Render code*/

	renderImages():React.ReactNode
	{
		const images = this.state.images.map(value => (
				<Col  sm='12' md='6' lg='4' className='mt-2'>
					<ImageShow image={value}/>
				</Col>
			));

		return (
			<React.Fragment>
					{images}
			</React.Fragment>
		);
	}

	render(): React.ReactNode
	{
		const blocked = this.state.loading ? 'mainwindow-blocker' : '';

		return (
			<React.Fragment>
				<Container fluid={true} style={{paddingLeft:0, paddingBottom:0}}>
					<div className={blocked}/>
					<Row>
						<Col xs='auto'>
							<SideBar category={this.state.category}
									 resolution={this.state.resolution}
									 onCategoryChange={this.onCategoryChange}
									 onResolutionChange={this.onResolutionChange}
							/>
						</Col>
						<Col className='mainwindow-mainlayout' style={{width:'100vh'}}>
								<Row className='mt-2'>
									{this.renderImages()}
								</Row>
						</Col>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export {MainWindow};
