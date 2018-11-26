import * as React from 'react';
import {State, Props} from "./State";
import {setImgUrl} from './State';
import {WallpaperCraftApi} from '../../utils/WallpaperCraftApi';
import {Button, Card, CardBody, CardImg, Col, Row} from "reactstrap";
import {ScaleLoader} from 'react-spinners';

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

	/*Life cycle code*/
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


	/*Render code*/
	render(): React.ReactNode
	{
		if(this.state.imgUrl === '')
		{
			return null;
		}

		return (
			<Card style={{width:'300px'}}>
				<CardImg top width='300px' src={this.state.imgUrl}/>
				<CardBody>
					<Row className='justify-content-end'>
						<Col xs='auto'>
							<Button color='primary' size='sm'
									onClick={this.props.onImageDownload}
							>
								{
									!this.props.isDownloading?
										<span className="fas fa-download pl-2 pr-2"/>
										:
										<ScaleLoader height={14}
													 width={2}
													 radius={2}
													 color='white'
										/>
								}
							</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}

export {ImageShow};