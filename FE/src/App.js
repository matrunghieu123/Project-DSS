import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/FireBase';
import Login from './components/Login';
import Register from './components/Register';
import ChatRoom from './components/ChatRoom';

const App = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<Router>
			<Routes>
				<Route path="/" element={user ? <Navigate to="/chatroom" /> : <Navigate to="/login" />} />
				<Route path="/login" element={user ? <Navigate to="/chatroom" /> : <Login />} />
				<Route path="/register" element={user ? <Navigate to="/chatroom" /> : <Register />} />
				<Route path="/chatroom" element={user ? <ChatRoom /> : <Navigate to="/login" />} />
			</Routes>
		</Router>
	);
};

export default App;

