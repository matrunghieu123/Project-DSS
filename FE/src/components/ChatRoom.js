import React, { useRef, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
// import ChatRoomHeader from '../header/ChatRoomHeader';
import ColNavbar from '../colnavbar/ColNavbar';
import MessageList from '../body/message/messagelist/MessageList';
import SendMessage from '../body/message/sendmessage/SendMessage';
import MessageInfor from '../body/message/messageinfor/MessageInfor';
import MemberList from '../body/member/MemberList';
import FilterBar from '../body/filterbar/FilterMenu';
import ChatTool from '../body/chattool/ChatTool';
import CallDialog from './calldialog/CallDialog';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
// import { auth } from '../firebase/FireBase';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';


var stompClient = null;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const ChatRoom = () => {
    // Thêm state để quản lý email và password
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab, setTab] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    const endOfMessagesRef = useRef(null);

    // Hàm đăng nhập Firebase
    // const login = () => {
    //     signInWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         const user = userCredential.user;
    //         console.log("Đăng nhập thành công:", user);
    //         setUserData({ ...userData, username: user.email, connected: true });
    //         connect();  // Kết nối đến WebSocket sau khi đăng nhập
    //     })
    //     .catch((error) => {
    //         console.error("Đăng nhập thất bại:", error.message);
    //     });
    // };

    // Hàm đăng ký người dùng mới
    // const register = () => {
    //     createUserWithEmailAndPassword(auth, email, password)
    //     .then((userCredential) => {
    //         const user = userCredential.user;
    //         console.log("Đăng ký thành công:", user);
    //         setUserData({ ...userData, username: user.email, connected: true });
    //         connect();  // Kết nối sau khi đăng ký thành công
    //     })
    //     .catch((error) => {
    //         console.error("Đăng ký thất bại:", error.message);
    //     });
    // };

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
        console.log("Đang cố gắng kết nối đến WebSocket");
    };
  
    const onConnected = () => {
        console.log("Đã kết nối đến WebSocket");
        console.log("User Data:", userData);  // Kiểm tra trạng thái userData
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
    };  

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        console.log("Tin nhắn nhận được:", payloadData);  // Kiểm tra tin nhắn nhận được
        switch(payloadData.status) {
            case "JOIN":
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
                default:
            // Xử lý các trường hợp không được dự đoán
            console.warn(`Nhận được tin nhắn với trạng thái không xác định: ${payloadData.status}`);
            break;
        }
    };
    
    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [payloadData];
            privateChats.set(payloadData.senderName, list);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (err) => {
        console.log(err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    // gửi ib trên chat tổng
    const sendValue = () => {
        if (stompClient && userData.message.trim() !== "") {
            const chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status: "MESSAGE"
            };
            console.log("Đang gửi tin nhắn đến chat công khai:", chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });
        }
    };
    
    // gửi ib trên chat riêng
    const sendPrivateValue = () => {
        if (stompClient && userData.message.trim() !== "") {
            const chatMessage = {
                senderName: userData.username,
                receiverName: tab,
                message: userData.message,
                status: "MESSAGE"
            };
            if (userData.username !== tab) {
                if (privateChats.get(tab)) {
                    privateChats.get(tab).push(chatMessage);
                    setPrivateChats(new Map(privateChats));
                } else {
                    let list = [chatMessage];
                    privateChats.set(tab, list);
                    setPrivateChats(new Map(privateChats));
                }
            }
            console.log("Đang gửi tin nhắn riêng:", chatMessage);
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            setUserData({ ...userData, message: "" });
        }
    };

    // phần đăng nhập cũ
    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    };
    const registerUser = () => {
        if (userData.username.trim() === "") {
            alert("Tên người dùng trống");
            return;
        }
        connect();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn ngừa gửi form hoặc thêm dòng mới
            if (tab === "CHATROOM") {
                sendValue();
            } else {
                sendPrivateValue();
            }
        }
    };

    // Thêm trạng thái mới
    const [isFilterCleared, setIsFilterCleared] = useState(false);

    // Hàm xử lý khi nhấn vào icon xóa bộ lọc
    const handleClearFilter = () => {
        setIsFilterCleared(true);
    };

    // Hàm để quay lại trạng thái bình thường
    const handleResetFilter = () => {
        setIsFilterCleared(false);
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div id="root" className="container-1">
                    <div className='header-nav'>
                        {/* <ChatRoomHeader /> */}
                    </div>
                    <div className="body-nav">
                        <div className="body-col-nav">
                            <div className="col-nav">
                                <ColNavbar setTab={setTab} handleResetFilter={handleResetFilter} />
                            </div>
                        </div>
                        
                        <div className="chat-box-body">
                            <div className="chat-box">
                                <div className='member-search'>
                                    <div className='search-box'>
                                    <Input
                                        className='search-button'
                                        placeholder="Tìm kiếm"
                                        allowClear
                                        onSearch={onSearch}
                                        size='large'
                                        prefix={<SearchOutlined />}
                                    />
                                    </div>

                                    <div className='member-box'>
                                        <MemberList privateChats={privateChats} setTab={setTab} tab={tab} />
                                    </div>
                                </div>
                                <div className="chat-content">
                                    <div 
                                        style={{
                                            margin: '16px 16px 0px 12px',
                                        }}
                                    >
                                        {/* Truyền handleClearFilter vào FilterBar */}
                                        <FilterBar onClearFilter={handleClearFilter} />
                                    </div>

                                        {/* Kiểm tra trạng thái isFilterCleared */}
                                        {isFilterCleared ? (
                                            // Hiển thị màn hình rỗng với thông báo
                                            <div className="empty-screen">
                                                <p>Chưa chọn cuộc hội thoại</p>
                                            </div>
                                        ) : (
                                            // Hiển thị nội dung chat bình thường
                                    <div className='chat-border'>
                                        <div className='text-input'>
                                            <div
                                                style={{
                                                    height: '20%',
                                                }}
                                            >
                                                <MessageInfor />
                                            </div>
                                            <div
                                                style={{
                                                    height: '72%',
                                                }}
                                            >
                                                <MessageList 
                                                    chats={tab === "CHATROOM" ? publicChats : privateChats.get(tab)} 
                                                    tab={tab} userData={userData} endOfMessagesRef={endOfMessagesRef} 
                                                />
                                            </div>
                                            <div
                                                style={{
                                                    height: '8%',
                                                    backgroundColor: 'white'
                                                }}
                                            >
                                                <SendMessage 
                                                    userData={userData} handleMessage={handleMessage} 
                                                    handleKeyPress={handleKeyPress} sendValue={sendValue} 
                                                    sendPrivateValue={sendPrivateValue} tab={tab} 
                                                />
                                            </div>
                                        </div>
                                    
                                        <div className='chat-tool'>
                                            <ChatTool 
                                                avatar={userData.username[0].toUpperCase()}  // Truyền ký tự đầu tiên của username làm avatar
                                                username={userData.username}  // Truyền username 
                                            />
                                        </div>
                                    </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <CallDialog />
                </div>
            ) : (
                <div className="register">
                    <input
                        className='name-input'
                        id="user-name"
                        placeholder="Nhập tên của bạn"
                        name="userName"
                        value={userData.username}
                        onChange={handleUsername}
                        margin="normal"
                    />
                    <button className='re-btn' type="button" onClick={registerUser}>
                        Tham gia
                    </button>
                </div>
                // Giao diện đăng nhập/đăng ký
                // <div className="register">
                //     <input
                //         className='name-input'
                //         placeholder="Nhập email"
                //         value={email}
                //         onChange={(e) => setEmail(e.target.value)}
                //     />
                //     <input
                //         className='name-input'
                //         type="password"
                //         placeholder="Nhập mật khẩu"
                //         value={password}
                //         onChange={(e) => setPassword(e.target.value)}
                //     />
                //     <button onClick={login}>Đăng nhập</button>
                //     <button onClick={register}>Đăng ký</button>
                // </div>
            )}
        </div>
    );
};

export default ChatRoom;
