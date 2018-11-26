import * as React from 'react';
import {State, Props} from './State';

/*TODO:
 * Make it so that it has indicators hasNext hasPrevious instead of hasMore
 * Make it call loadPrevious and display ender
 * Side note: This will require you to implement appendImages prependImages
 * as well as keeping track of first loaded and last loaded page and api to
 * get number of pages*/

class InfiniteScroll extends React.Component<Props, State>
{

	constructor(props:Props)
	{
		super(props);

		this.state =
			{

			};


		this.onScroll = this.onScroll.bind(this);
	}




	/*View code*/
	onScroll(event:any):void
	{
		let div:HTMLDivElement = event.target;

		if(!this.props.loading && this.props.hasMore &&
			div.scrollHeight == div.scrollTop + div.clientHeight)
		{
			this.props.loadNext();
		}
	}

	/*Render code*/
	render(): React.ReactNode
	{
		return (
			<div style={{height:this.props.height,overflowY:'auto', overflowX:'hidden'}}
				 onScroll={this.onScroll}
			>
				{this.props.children}
				{
					this.props.loading && this.props.loader &&
					this.props.loader
				}
			</div>
		);
	}

}

export {InfiniteScroll};