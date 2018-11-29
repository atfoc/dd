import './style.css';
import * as React from 'react';
import {State, Props, setLoadingImages} from './State';
import {setCategory, setResolution, setChanging, addImages, clearImages} from './State';
import {addToDownloadSet, removeFromDownloadSet} from './State';
import {prepandImages, removeLastImages, removeFirstImages} from './State';
import {WallpaperCraftApi} from '../../utils/WallpaperCraftApi';
import {downloadImage} from '../../utils/SystemApi';
import {Channels} from "../../utils/Channels";
const ipcRenderer = (window as any).require('electron').ipcRenderer;

import {Col, Container, Row} from "reactstrap";
import {SideBar} from "../SideBar/SideBar";
import {ImageShow} from '../ImageShow/ImageShow';
import {InfiniteScroll} from '../InfiniteScroll/InfiniteScroll';

import {Image} from "../../models/Image";
import {Category} from "../../models/Category";
import {ScaleLoader} from "react-spinners";


class MainWindow extends React.Component<Props, State>
{

	private api:WallpaperCraftApi;
	private readonly onReloadImages:()=>void;
	private readonly onLoadNext:()=>void;
	private readonly onLoadPrev:()=>void;
	private randomCategory:(()=>Category) | null;
	private firstPageLoaded:number;
	private lastPageLoaded:number;
	private static numOfPagesLoaded:number;
	private static numOfImagesPerPage:number;
	private prevCategories:Array<Category>;

	constructor(props:Props)
	{
		super(props);

		this.state =
			{
				category:null,
				resolution:null,
				changingSearch:false,
				images:[],
				loadingMoreImages:true,
				downloadingImages:new Set()
			};

		this.api = WallpaperCraftApi.getInstance();
		this.randomCategory = null;
		this.firstPageLoaded = 0;
		this.lastPageLoaded = 0;
		this.prevCategories = [];
		MainWindow.numOfPagesLoaded = 5;
		MainWindow.numOfImagesPerPage = 15;

		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onResolutionChange = this.onResolutionChange.bind(this);
		this.onReloadImages = this.onGetMoreImages.bind(this, 0);
		this.onLoadNext = this.onGetMoreImages.bind(this, 1);
		this.onLoadPrev = this.onGetMoreImages.bind(this, -1);
		this.onImageFinishedDownload = this.onImageFinishedDownload.bind(this);
	}

	/*Life cycle code*/
	componentDidMount(): void
	{
		ipcRenderer.on(Channels.downloadImage+'Ret', this.onImageFinishedDownload);
	}

	componentWillUnmount(): void
	{
		ipcRenderer.removeAllListeners(Channels.downloadImage+'Ret');
	}


	/*View code*/
	onGetMoreImages(direction:number)
	{
		if(this.state.resolution && this.state.category)
		{
			let pageToLoad = 0;
			let cat  = this.state.category;

			if(direction === 0)
			{
				/*Todo load MainWindow.numOfPagesLoaded instead of one*/
				this.firstPageLoaded = 1;
				this.lastPageLoaded = 1;
				pageToLoad = this.firstPageLoaded;

			}
			else if(direction > 0)
			{
				/*TODO:check if next page exists*/
				++this.lastPageLoaded;
				if(this.lastPageLoaded - this.firstPageLoaded > MainWindow.numOfPagesLoaded)
				{
					++this.firstPageLoaded;
				}
				pageToLoad = this.lastPageLoaded;

			}
			else
			{
				if(this.firstPageLoaded <= 1)
				{
					console.log('Cant load before first page');
					return;
				}

				--this.firstPageLoaded;
				if(this.lastPageLoaded - this.firstPageLoaded > MainWindow.numOfPagesLoaded)
				{
					--this.lastPageLoaded;
				}
				pageToLoad = this.firstPageLoaded;
			}
			this.setState(setLoadingImages(true));
			if(this.randomCategory)
			{
				if(pageToLoad <= this.prevCategories.length)
				{
					cat = this.prevCategories[pageToLoad-1]
				}
				else
				{
					cat = this.randomCategory();
					this.prevCategories.push(cat);
				}
				this.setState(setCategory(cat));
			}

			this.api.getImages(this.state.resolution, cat, pageToLoad)
				.then(value => this.onImagesRecived(value, direction))
				.catch(reason =>
				{
					console.log(reason);
					this.setState(setChanging(false));
				});

			console.log(`first:${this.firstPageLoaded} last:${this.lastPageLoaded}`);
		}
	}

	onCategoryChange(category: Category|(()=>Category)):void
	{
		if(typeof category === 'function')
		{
			this.randomCategory = category;
		}
		else
		{
			this.setState(setCategory(category));
			this.randomCategory = null;
		}
		this.setState(setChanging(true));
		this.setState(clearImages, this.onReloadImages);
	}

	onResolutionChange(resolution:string):void
	{
		this.setState(setResolution(resolution));
		this.setState(setChanging(true));
		this.setState(clearImages, this.onReloadImages);

	}

	onImagesRecived(images:Array<Image>, direction:number):void
	{
		if(direction < 0)
		{
			this.setState(prepandImages(images));
			this.setState(removeLastImages(MainWindow.numOfImagesPerPage));

		}
		else if(direction > 0 && this.lastPageLoaded - this.firstPageLoaded>= MainWindow.numOfPagesLoaded)
		{
			this.setState(addImages(images));
			this.setState(removeFirstImages(MainWindow.numOfImagesPerPage));
		}
		else
		{
			this.setState(addImages(images))
		}
		this.setState(setChanging(false));
		this.setState(setLoadingImages(false));
	}

	onImageDownload(index:number):void
	{
		if(this.state.resolution)
		{
			this.setState(addToDownloadSet(this.state.images[index].name),
				() => downloadImage(this.state.images[index], this.state.resolution!));
		}
	}

	onImageFinishedDownload(event:any, name:any):void
	{
		if(typeof name !== 'string')
		{
			return ;
		}
		this.setState(removeFromDownloadSet(name));
	}

	/*Render code*/

	renderImages():React.ReactNode
	{
		const images = this.state.images.map((value,index) => (
				<Col  sm='12' md='6' lg='4' className='mt-2'>
					<ImageShow image={value}
							   onImageDownload={()=>this.onImageDownload(index)}
							   isDownloading={this.state.downloadingImages.has(value.name)}
							   key={value.name}
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
						<Col className='mainwindow-mainlayout' style={{width:'100vh',
							overflow:'hidden'}}>
							<InfiniteScroll hasNext={true}
											hasPrev={this.firstPageLoaded > 1}
											loading={this.state.loadingMoreImages}
											height='100vh'
											loadNext={this.onLoadNext}
											loadPrev={this.onLoadPrev}
											numberOfLoadedPages={MainWindow.numOfPagesLoaded}
											ender=
												{
													<div style={{textAlign:'center'}}>
														end
													</div>}
											loader=
												{
													<div style={
													{
														paddingTop:'39vh',
														paddingBottom:'39vh',
														paddingLeft:'39vw',
														paddingRight:'39vw',
														position: 'absolute',
														top: 0,
														left: 0,
														zIndex: 99,
														backgroundColor: 'rgba(0, 0, 0, 0.8)'
													}}
													className='align-content-center'
													>

													<div style={{width:'20vw', height:'20vh'}}>
													<ScaleLoader height={5}
																 heightUnit={'vh'}
																 width={3}
																 widthUnit={'vw'}
																 radius={2}
																 color='white'
													/>
													</div>
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
