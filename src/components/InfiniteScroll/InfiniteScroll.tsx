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

	private prevOffset:number;
	private direction: number;

	constructor(props:Props)
	{
		super(props);

		this.state =
			{

			};

		this.prevOffset = 0;
		this.direction = 0;

		this.onScroll = this.onScroll.bind(this);
	}




	/*View code*/
	onScroll(event:any):void
	{
		let div:HTMLDivElement = event.target;

		this.direction =   div.scrollTop - this.prevOffset;
		this.prevOffset = div.scrollTop;

		if(this.direction < 0)
		{
			if(div.scrollTop === 0 && !this.props.loading && this.props.hasPrev)
			{
				this.props.loadPrev();
				//div.scrollBy(0, 5);
				div.scrollBy(0, div.scrollHeight/this.props.numberOfLoadedPages+10);
			}
		}
		else if(this.direction > 0)
		{
			if(div.scrollTop + div.clientHeight === div.scrollHeight &&
				!this.props.loading && this.props.hasNext)
			{
				this.props.loadNext();
				div.scrollBy(0, -div.scrollHeight/this.props.numberOfLoadedPages);
			}
		}
		else
		{
			console.log('I dont know what direction are you scrolling');
		}
	}

	/*Render code*/
	render(): React.ReactNode
	{
		return (
			<div style={{height:this.props.height,overflowY:'auto', overflowX:'hidden'}}
				 onScroll={this.onScroll}
			>
				{
					this.props.loading && this.props.loader && this.direction <= 0 &&
					this.props.loader
				}
				{this.props.children}
				{
					this.props.loading && this.props.loader && this.direction > 0 &&
					this.props.loader
				}
			</div>
		);
	}

}

export {InfiniteScroll};