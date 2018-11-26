import './style.css';
import * as React from 'react';
import {State, Props, setLoadingImages} from './State';
import {setCategory, setResolution, setChanging, addImages, clearImages} from './State';
import {WallpaperCraftApi} from '../../utils/WallpaperCraftApi';
const ipcRenderer= (window as any).require('electron').ipcRenderer;

import {Col, Container, Row} from "reactstrap";
import {SideBar} from "../SideBar/SideBar";
import {ImageShow} from '../ImageShow/ImageShow';
import {InfiniteScroll} from '../InfiniteScroll/InfiniteScroll';

import {Image} from "../../models/Image";

class MainWindow extends React.Component<Props, State>
{

	private api:WallpaperCraftApi;
	private onReloadImages:()=>void;
	private currentPage:number;
	private onLoadNext:()=>void;

	constructor(props:Props)
	{
		super(props);

		this.state =
			{
				category:null,
				resolution:null,
				changingSearch:false,
				images:[],
				loadingMoreImages:true
			};

		this.api = WallpaperCraftApi.getInstance();
		this.currentPage = 0;

		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onResolutionChange = this.onResolutionChange.bind(this);
		this.onImagesRecived = this.onImagesRecived.bind(this);
		this.onReloadImages = this.onGetMoreImages.bind(this, 0);
		this.onLoadNext = this.onGetMoreImages.bind(this, 1);
	}



	/*View code*/
	onGetMoreImages(direction:number)
	{
		if(this.state.resolution && this.state.category)
		{
			if(direction === 0)
			{
				this.currentPage = 1;
			}
			else if(direction > 0)
			{
				++this.currentPage;
			}
			else
			{
				/*load previous page*/
			}
			this.setState(setLoadingImages(true));
			this.api.getImages(this.state.resolution, this.state.category, this.currentPage)
				.then(this.onImagesRecived)
				.catch(reason =>
				{
					console.log(reason);
					this.setState(setChanging(false));
				});
		}
	}

	onCategoryChange(category: string):void
	{
		this.setState(setCategory(category));
		this.setState(setChanging(true));
		this.setState(clearImages, this.onReloadImages);
	}

	onResolutionChange(resolution:string):void
	{
		this.setState(setResolution(resolution));
		this.setState(setChanging(true));
		this.setState(clearImages, this.onReloadImages);

	}

	onImagesRecived(images:Array<Image>):void
	{
		this.setState(addImages(images));
		this.setState(setChanging(false));
		this.setState(setLoadingImages(false));
	}

	onImageDownload(index:number)
	{
		if(this.state.resolution)
		{
			this.api.getImageUrl(this.state.images[index], this.state.resolution)
				.then(value => ipcRenderer.send('imageDownload', value,
					`${this.state.images[index].name}.${this.state.images[index].format}`))
				.catch(reason => console.log(reason));
		}
	}

	/*Render code*/

	renderImages():React.ReactNode
	{
		const images = this.state.images.map((value,index) => (
				<Col  sm='12' md='6' lg='4' className='mt-2'>
					<ImageShow image={value}
							   onImageDownload={()=>this.onImageDownload(index)}
					/>
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
		const blocked = this.state.changingSearch ? 'mainwindow-blocker' : '';

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
							<InfiniteScroll hasMore={true}
											loading={this.state.loadingMoreImages}
											height='100vh'
											loadNext={this.onLoadNext}
											loadPrev={() => {}}
											ender=
												{
													<div style={{textAlign:'center'}}>
														end
													</div>}
											loader=
												{
													<div style={{textAlign:'center'}}>
														Loading...
													</div>
												}
							>
								<Row className='mt-2'>
									{this.renderImages()}
								</Row>
							</InfiniteScroll>
						</Col>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export {MainWindow};
