import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/FireBase';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Đăng nhập thành công:", userCredential.user);
                navigate('/chatroom');
            })
            .catch((error) => {
                console.error("Đăng nhập thất bại:", error.message);
            });
    };

    return (
        <div style={styles.container}>
            <input
                style={styles.input}
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                style={styles.input}
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button style={styles.button} onClick={login}>Đăng nhập</button>
            <button style={styles.button} onClick={() => navigate('/register')}>Đăng ký</button>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxSizing: 'border-box',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    input: {
        border: '2px solid #ccc',
        margin: '5px',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '1em',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        border: 'none',
        margin: '10px',
        padding: '10px',
        backgroundColor: 'green',
        color: '#fff',
        fontSize: '1.2em',
        fontWeight: 'bold',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

export default Login;
