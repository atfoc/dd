import './style.css';
import * as React from 'react';
import {State, Props} from './State';
import {setCategory, setResolution, toggleLoading} from './State';

import {Col, Container, Row} from "reactstrap";

import {SideBar} from "../SideBar/SideBar";

class MainWindow extends React.Component<Props, State>
{

	constructor(props:Props)
	{
		super(props);

		this.state =
			{
				category:null,
				resolution:null,
				loading:false
			};


		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onResolutionChange = this.onResolutionChange.bind(this);
	}


	/*View code*/
	onCategoryChange(category: string):void
	{
		this.setState(setCategory(category));
		this.setState(toggleLoading, ()=>setTimeout(()=>this.setState(toggleLoading),1000));
	}

	onResolutionChange(resolution:string):void
	{
		this.setState(setResolution(resolution));
		this.setState(toggleLoading, ()=>setTimeout(()=>this.setState(toggleLoading),1000));

	}

	/*Render code*/
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
						<Col className='mainwindow-mainlayout'>
							<h1>Resolution is: {this.state.resolution}</h1>
							<h1>Category is {this.state.category}</h1>
						</Col>
					</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export {MainWindow};
