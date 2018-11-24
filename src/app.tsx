import * as React from 'react';
import {HashRouter, Route} from 'react-router-dom';

import {MainWindow} from './components/MainWindow/MainWindow';



export default function App()
{
	return (
		<HashRouter>
			<Route path='/MainWindow' component={MainWindow}/>
		</HashRouter>
	);
}