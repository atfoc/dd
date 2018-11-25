import './style.css';
import * as React from 'react';
import {Button, Col, Row} from "reactstrap";

import {WallpaperCraftApi} from '../../utils/WallpaperCraftApi';
const {screen} = (window as any).require('electron').remote;

import {Props, State} from './State';
import {toggleSideBar, setCategories, setResolutions} from './State';
import {CSSProperties} from "react";

class SideBar extends React.Component<Props, State>
{
	private api : WallpaperCraftApi;
	constructor(props:Props)
	{
		super(props);
		this.state =
			{
				opened:false,
				resolutions:[],
				categories:[]
			};

		this.api = WallpaperCraftApi.getInstance();

		this.onToggleButtonClicked = this.onToggleButtonClicked.bind(this);
		this.onResponseReceived = this.onResponseReceived.bind(this);
		this.onResolutionChange = this.onResolutionChange.bind(this);
	}


	/*Life cycle methods*/
	componentDidMount(): void
	{
		this.api.getResolutions()
			.then((value)=>
			{
				 this.api.getCategories()
					 .then(value1 => this.onResponseReceived(value, value1))
					 .catch(reason => console.log(reason) );
			})
			.catch(reason => console.log(reason) );

	}

	/*View code*/
	onToggleButtonClicked():void
	{
		this.setState(toggleSideBar);
	}

	onResponseReceived(resolutions:Array<string>, categories:Array<string>)
	{

		this.setState(setResolutions(resolutions));
		this.setState(setCategories(categories));
		if(!this.props.resolution)
		{
			let size = screen.getPrimaryDisplay().size;
			let resIndex = resolutions.indexOf(`${size.width}x${size.height}`);

			this.props.onResolutionChange(resolutions[resIndex === -1 ? 0 : resIndex]);
		}
		if(!this.props.category)
		{
			this.props.onCategoryChange(this.state.categories[0]);
		}

	}


	onResolutionChange(event:any):void
	{
		let res = event.target.value;
		if(typeof  res === 'string')
		{
			this.props.onResolutionChange(res);
		}
	}

	onCategoryChange(category:string):void
	{
		this.props.onCategoryChange(category);
	}

	/*Render code*/

	renderResolution():React.ReactNode
	{
		const options = this.state.resolutions.map(value =>
		{

			let selected = this.props.resolution === value;
			return (
				<option selected={selected}>{value}</option>
			);
		});

		return (
			<select className='form-control' onChange={this.onResolutionChange}>
				{options}
			</select>
		);
	}

	renderCategories():React.ReactNode
	{
		const options = this.state.categories.map(value =>
		{

			let selected:CSSProperties = {};

			selected.cursor = 'pointer';
			if(value === this.props.category)
			{
				selected.color = 'white';
				selected.fontWeight = 'bold';
			}

			return (
				<Row className='mt-2 justify-content-center'>
					<Col xs='auto' style={selected}
						 onClick={this.onCategoryChange.bind(this, value)}>
						{value}
					</Col>
				</Row>
			);
		});

		return (
			<div>
				{options}
			</div>
		);
	}

	render(): React.ReactNode
	{
		const sidebarActivation = this.state.opened ? 'sidebar-active' : 'sidebar-inactive';

		return (
			<div className={`sidebar ${sidebarActivation}`}>
				<Row className='justify-content-end'>
					<Col xs='auto'>
						<Button
							onClick={this.onToggleButtonClicked}
						>
							Toggle
						</Button>
					</Col>
				</Row>

				{
					this.state.resolutions.length !== 0 && this.state.opened &&
					<Row className='mt-2'>
						<Col>
							{this.renderResolution()}
						</Col>
					</Row>
				}

				{
					this.state.categories.length !== 0 && this.state.opened &&
					<Row className='mt-2'>
						<Col>
							{this.renderCategories()}
						</Col>
					</Row>
				}
			</div>
		);
	}
}

export {SideBar};