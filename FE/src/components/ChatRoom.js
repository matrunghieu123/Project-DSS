import React, { useRef, useState } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
// import ChatRoomHeader from '../header/ChatRoomHeader';
import ColNavbar from '../colnavbar/ColNavbar';
import MessageList from '../body/message/MessageList';
import SendMessage from '../body/message/sendmessage/SendMessage';
import MemberList from '../body/member/MemberList';
import Search from 'antd/es/input/Search';
import FilterBar from '../body/filterbar/FilterMenu';
import ChatTool from '../body/chattool/ChatTool';
import CallDialog from './calldialog/CallDialog';

var stompClient = null;
const onSearch = (value, _e, info) => console.log(info?.source, value);

const ChatRoom = () => {
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

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
        console.log("Đang cố gắng kết nối đến WebSocket");
    };
  
    const onConnected = () => {
        console.log("Đã kết nối đến WebSocket");
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
                                <div className='member-seach'>
                                    <div className='seach-box'>
                                    <Search
                                        className='seach-button'
                                        placeholder="Tìm kiếm"
                                        allowClear
                                        onSearch={onSearch}
                                        size='large'
                                        style={{
                                            width: '100%',
                                            maxWidth: 300,
                                            margin: 5,
                                        }}
                                    />
                                    </div>

                                    <div className='member-box'>
                                        <MemberList privateChats={privateChats} setTab={setTab} tab={tab} />
                                    </div>
                                </div>
                                <div className="chat-content">
                                    <div 
                                        style={{
                                            paddingTop: 5,
                                            paddingRight: 10,
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
                                                <MessageList 
                                                    chats={tab === "CHATROOM" ? publicChats : privateChats.get(tab)} 
                                                    tab={tab} userData={userData} endOfMessagesRef={endOfMessagesRef} 
                                                />
                                                <SendMessage 
                                                    userData={userData} handleMessage={handleMessage} 
                                                    handleKeyPress={handleKeyPress} sendValue={sendValue} 
                                                    sendPrivateValue={sendPrivateValue} tab={tab} 
                                                />
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
                    <button type="button" onClick={registerUser}>
                        Tham gia
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatRoom;
