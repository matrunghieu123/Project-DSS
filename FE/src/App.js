import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatRoom from './components/ChatRoom';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ChatRoom />} />
			</Routes>
		</Router>
	);
};

export default App;
