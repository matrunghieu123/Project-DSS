import React, { useRef, useState, useEffect } from 'react';
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
import { auth } from '../firebase/FireBase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


const onSearch = (value, _e, info) => console.log(info?.source, value);

const db = getFirestore(); // Khởi tạo Firestore

const ChatRoom = () => {
    // Thêm state để quản lý email và password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab, setTab] = useState("CHATROOM");
    const [loginType, setLoginType] = useState("CHATROOM"); // Thêm state để quản lý loại đăng nhập
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    const endOfMessagesRef = useRef(null);

    const stompClientRef = useRef(null); // Sử dụng useRef để quản lý stompClient

    const storage = getStorage(); // Khởi tạo Storage

    const uploadFileToFirebase = async (file) => {
        try {
            const storageRef = ref(storage, `uploads/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL; // Trả về URL để hiển thị trong tin nhắn
        } catch (error) {
            console.error("Lỗi khi tải lên Firebase Storage:", error);
            return null; // Nếu có lỗi thì trả về null
        }
    };

    useEffect(() => {
        if (userData.connected) {
            loadMessagesFromFirestore(userData.username);
        }
    }, [userData.connected, userData.username]); // Thêm userData.username vào mảng phụ thuộc

    // Hàm đăng nhập Firebase
    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Đăng nhập thành công:", user);
                // Sử dụng tên người dùng nhập thay vì email
                const username = userData.username; // Lấy username từ dữ liệu người dùng nhập
                setUserData({ ...userData, username, connected: true });
                setTab(username); // Đặt tab thành tên người dùng vừa đăng nhập
                loadMessagesFromFirestore(username); // Thêm dòng này để tải tin nhắn ngay sau khi đăng nhập
                connect();
            })
            .catch((error) => {
                console.error("Đăng nhập thất bại:", error.message);
            });
    };

    // Hàm đăng ký người dùng mới
    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Đăng ký thành công:", user);
                // Sử dụng tên người dùng nhập thay vì email
                const username = userData.username; // Lấy username từ dữ liệu người dùng nhập
                setUserData({ ...userData, username, connected: true });
                setTab(username); // Đặt tab thành tên người dùng vừa đăng ký
                loadMessagesFromFirestore(username); // Thêm dòng này để tải tin nhắn ngay sau khi đăng ký
                connect();
            })
            .catch((error) => {
                console.error("Đăng ký thất bại:", error.message);
            });
    };

    const connect = () => {
        let Sock = new SockJS('http://171.224.180.20:9090/ws'); // Thay thế địa chỉ IP và cổng
        stompClientRef.current = over(Sock);
        stompClientRef.current.connect({}, onConnected, onError);
        console.log("Đang cố gắng kết nối đến WebSocket");
    };

    const onConnected = () => {
        console.log("Đã kết nối đến WebSocket");
        console.log("User Data:", userData);  // Kiểm tra trạng thái userData
        setUserData({ ...userData, connected: true });
        stompClientRef.current.subscribe('/topic/public', onMessageReceived); // Đăng ký vào kênh công khai
        stompClientRef.current.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
        userJoin();
        loadMessagesFromFirestore(userData.username); // Thêm dòng này để tải tin nhắn ngay sau khi kết nối
    };

    const userJoin = () => {
        var chatMessage = {
            senderName: userData.username,
            status: "JOIN"
        };
        stompClientRef.current.send("/app/message", {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        try {
            var payloadData = JSON.parse(payload.body);
            console.log("Tin nhắn nhận được:", payloadData);

            // Gán giá trị mặc định cho các trường null
            payloadData.chatId = payloadData.chatId || 'defaultChatId';
            payloadData.fileType = payloadData.fileType || 'text';
            payloadData.fileUrl = payloadData.fileUrl || '';
            payloadData.fileName = payloadData.fileName || '';  // fileName
            payloadData.message = payloadData.message || '';
            payloadData.receiverName = payloadData.receiverName || 'chat tổng';
            payloadData.senderName = payloadData.senderName || 'unknown';
            payloadData.time = payloadData.time || new Date().toLocaleTimeString();

            switch(payloadData.status) {
                case "JOIN":
                    if (!privateChats.get(payloadData.senderName)) {
                        privateChats.set(payloadData.senderName, []);
                        setPrivateChats(new Map(privateChats));
                    }
                    break;

                case "MESSAGE":
                    if (payloadData.receiverName === "chat tổng") {
                        setPublicChats(prevPublicChats => [...prevPublicChats, payloadData]);
                    } else {
                        // Xử lý tin nhắn riêng tư
                        addMessageToPrivateChat(payloadData);
                    }
                    break;

                default:
                    console.warn(`Nhận được tin nhắn với trạng thái không xác định: ${payloadData.status}`);
                    break;
            }
        } catch (error) {
            console.error("Lỗi khi xử lý tin nhắn nhận được:", error);
        }
    };

    const onPrivateMessage = (payload) => {
        try {
            const payloadData = JSON.parse(payload.body);
            console.log("Tin nhắn riêng nhận được:", payloadData); // Thêm log để kiểm tra

            // Chỉ xử lý tin nhắn đến từ người khác, không xử lý tin nhắn tự gửi
            if (payloadData.senderName !== userData.username) {
                addMessageToPrivateChat(payloadData);
            }
        } catch (error) {
            console.error("Lỗi khi xử lý tin nhắn riêng:", error);
        }
    };

    const addMessageToPrivateChat = (message) => {
        setPrivateChats(prevChats => {
            const newChats = new Map(prevChats);
            const chatList = newChats.get(message.receiverName) || [];
            const messageId = `${message.senderName}-${message.time}`;
            if (!chatList.some(msg => `${msg.senderName}-${msg.time}` === messageId)) {
                newChats.set(message.receiverName, [...chatList, { ...message, id: messageId }]);
            }
            return newChats;
        });
    };

    const onError = (err) => {
        console.log(err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (tab === "CHATROOM") {
                sendValue(userData.message);
            } else {
                sendPrivateValue(userData.message);
            }
        }
    };

    const handleUsername = (event) => {
        setUserData({ ...userData, username: event.target.value });
    };

    // Hàm sendValue để gửi tin nhắn công khai
    const sendValue = async (message, files = []) => {
        if (stompClientRef.current && (message.trim() !== '' || files.length > 0)) {
            try {
                let fileUrl = null;
                let fileName = null;
                let fileType = null;
    
                if (files.length > 0) {
                    fileUrl = await uploadFileToFirebase(files[0]); // Tải file lên Firebase Storage
                    fileName = files[0].name;
                    fileType = files[0].type;
                }
    
                const chatMessage = {
                    senderName: userData.username,
                    receiverName: "chat tổng",
                    message: message || "",
                    status: "MESSAGE",
                    fileType: fileType,
                    fileUrl: fileUrl,
                    fileName: fileName,
                    time: new Date().toLocaleTimeString()
                };
    
                stompClientRef.current.send("/app/message", {}, JSON.stringify(chatMessage));
                setPublicChats(prevPublicChats => [...prevPublicChats, chatMessage]);
    
                setUserData({ ...userData, message: "" });
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        }
    };  

    // Hàm sendPrivateValue để gửi tin nhắn riêng tư
    const sendPrivateValue = async (message, files = []) => {
        if (stompClientRef.current && (message.trim() !== '' || files.length > 0)) {
            try {
                let fileUrl = null;
                let fileName = null;
                let fileType = null;
    
                if (files.length > 0) {
                    fileUrl = await uploadFileToFirebase(files[0]); // Tải file lên Firebase Storage
                    fileName = files[0].name;
                    fileType = files[0].type;
                }
    
                const chatMessage = {
                    senderName: userData.username,
                    receiverName: tab,
                    message: message || "",
                    status: "MESSAGE",
                    fileType: fileType,
                    fileUrl: fileUrl,
                    fileName: fileName,
                    time: new Date().toLocaleTimeString()
                };
    
                stompClientRef.current.send("/app/private-message", {}, JSON.stringify(chatMessage));
                addMessageToPrivateChat(chatMessage);
                setUserData({ ...userData, message: "" });
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
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

    const loadMessagesFromFirestore = async (username) => {
        try {
            const publicQuery = query(collection(db, "messages"), where("receiverName", "==", "chat tổng"));
            const privateQuery = query(collection(db, "messages"), where("receiverName", "==", username));

            const publicQuerySnapshot = await getDocs(publicQuery);
            const privateQuerySnapshot = await getDocs(privateQuery);

            const loadedPublicMessages = [];
            const loadedPrivateMessages = new Map();

            publicQuerySnapshot.forEach((doc) => {
                loadedPublicMessages.push(doc.data());
            });

            privateQuerySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!loadedPrivateMessages.has(data.senderName)) {
                    loadedPrivateMessages.set(data.senderName, []);
                }
                loadedPrivateMessages.get(data.senderName).push(data);
            });

            setPublicChats(loadedPublicMessages);
            setPrivateChats(loadedPrivateMessages);
        } catch (error) {
            console.error("Lỗi khi tải tin nhắn từ Firestore: ", error);
        }
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="container-1">
                    <div className='header-nav'>
                        {/* <ChatRoomHeader /> */}
                    </div>
                    <div className="body-nav">
                        <div className="body-col-nav">
                            <div className="col-nav">
                                <ColNavbar setTab={setTab} handleResetFilter={handleResetFilter} setLoginType={setLoginType} />
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
                                        <div className='member-list'>
                                            <MemberList privateChats={privateChats} setTab={setTab} tab={tab} />
                                        </div>
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
                                        <div className='chat-input'>
                                            <div className='text-input'>
                                                <div>
                                                    <div 
                                                        style={{
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <MessageInfor />
                                                    </div>
                                                </div>
                                                <div className='chat-input-box'>
                                                    <div className='chat-input-box-1'>
                                                        <div style={{
                                                            flex: 1,
                                                            display: 'flex',
                                                            overflow: 'hidden',
                                                            position: 'relative',
                                                            flexDirection: 'column',
                                                        }}>
                                                            <MessageList 
                                                                chats={tab === "CHATROOM" ? publicChats : privateChats.get(tab) || []} 
                                                                tab={tab} userData={userData} endOfMessagesRef={endOfMessagesRef} 
                                                            />
                                                        </div>
                                                        <div style={{
                                                            backgroundColor: 'white',
                                                        }}>
                                                            <SendMessage 
                                                                userData={userData} handleMessage={handleMessage} 
                                                                handleKeyPress={handleKeyPress} sendValue={sendValue} 
                                                                sendPrivateValue={sendPrivateValue} tab={tab} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className='chat-tool-wrapper'>
                                            <div className='chat-tool'>
                                                <ChatTool 
                                                    avatar={userData.username[0].toUpperCase()}  // Truyền ký tự đầu tiên của username làm avatar
                                                    username={userData.username}  // Truyền username 
                                                />
                                            </div>
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

                // Giao diện đăng nhập/đăng ký
                <div className="register">
                    {loginType === "CHATROOM" ? (
                        <>
                            <input
                                className='name-input'
                                id="user-name"
                                placeholder="Nhập tên của bạn"
                                name="userName"
                                value={userData.username}
                                onChange={handleUsername} // Hàm này sẽ cập nhật state của username
                            />
                            <input
                                className='name-input'
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                className='name-input'
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button onClick={login}>Đăng nhập</button>
                            <button onClick={register}>Đăng ký</button>
                        </>
                    ) : (
                        <p>Vui lòng đăng nhập từ ứng dụng {loginType}</p>
                    )}
                </div>

            )}
        </div>
    );
};

export default ChatRoom;
