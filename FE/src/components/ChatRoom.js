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


var stompClient = null;
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
            setUserData({ ...userData, username: user.email, connected: true });
            connect();  // Kết nối đến WebSocket sau khi đăng nhập
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
            setUserData({ ...userData, username: user.email, connected: true });
            connect();  // Kết nối sau khi đăng ký thành công
        })
        .catch((error) => {
            console.error("Đăng ký thất bại:", error.message);
        });
    };

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
        try {
            var payloadData = JSON.parse(payload.body);
            console.log("Tin nhắn nhận được:", payloadData);

            // Gán giá trị mặc định cho các trường null
            payloadData.chatId = payloadData.chatId || 'defaultChatId';
            payloadData.fileType = payloadData.fileType || 'text';
            payloadData.fileUrl = payloadData.fileUrl || '';
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
<<<<<<< HEAD
                    break;

=======
                    break;  
>>>>>>> e468a92f29073980f53a6be313403cf92060052c
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

            // Gán giá trị mặc định cho các trường null
            payloadData.chatId = payloadData.chatId || 'defaultChatId';
            payloadData.fileType = payloadData.fileType || 'text';
            payloadData.fileUrl = payloadData.fileUrl || '';
            payloadData.message = payloadData.message || '';
            payloadData.receiverName = payloadData.receiverName || 'unknown';
            payloadData.senderName = payloadData.senderName || 'unknown';
            payloadData.time = payloadData.time || new Date().toLocaleTimeString();

            // Chỉ xử lý tin nhắn đến, không xử lý tin nhắn gửi đi
            if (payloadData.senderName !== userData.username) {
                if (payloadData.file) {
                    // Xử lý file nếu có
                    payloadData.file = new Blob([payloadData.file], { type: payloadData.file.type });
                }
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
            const messageId = `${message.senderName}-${message.timestamp}`;
            if (!chatList.some(msg => `${msg.senderName}-${msg.timestamp}` === messageId)) {
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

    // Hàm sendValue để gửi tin nhắn công khai
    const sendValue = (message, files = []) => {
        if (stompClient && (message.trim() !== '' || files.length > 0)) { // Kiểm tra tin nhắn không rỗng hoặc có file
            try {
                const chatMessage = {
                    senderName: userData.username,
                    receiverName: "chat tổng", // Thêm receiverName là "chat tổng"
                    message: message || "",
                    status: "MESSAGE",
                    fileType: files.length > 0 ? files[0].type : null,  // Nếu có file thì truyền loại file, nếu không thì truyền null
                    fileUrl: files.length > 0 ? URL.createObjectURL(files[0]) : null,  // Nếu có file thì tạo URL cho file, nếu không thì truyền null
                    timestamp: new Date().getTime()
                };
    
                stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    
                // Cập nhật trực tiếp vào danh sách publicChats nếu cần
                setPublicChats(prevPublicChats => [...prevPublicChats, chatMessage]);
    
                // Xóa nội dung sau khi gửi
                setUserData({ ...userData, message: "" });
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        }
    };
    
    
    // Hàm sendPrivateValue để gửi tin nhắn riêng tư
    const sendPrivateValue = (message, files = []) => {
        if (stompClient && (message.trim() !== '' || files.length > 0)) { // Kiểm tra tin nhắn không rỗng hoặc có file
            try {
                // Tạo đối tượng chatMessage chứa thông tin tin nhắn
                const chatMessage = {
                    senderName: userData.username, // Tên người gửi
                    receiverName: tab, // Tên người nhận (tab hiện tại)
                    message: message || "",  // Truyền message nếu có, nếu không thì truyền chuỗi rỗng
                    status: "MESSAGE", // Trạng thái tin nhắn
                    fileType: files.length > 0 ? files[0].type : null,  // Nếu có file thì truyền loại file, nếu không thì truyền null
                    fileUrl: files.length > 0 ? URL.createObjectURL(files[0]) : null,  // Nếu có file thì tạo URL cho file, nếu không thì truyền null
                    timestamp: new Date().getTime() // Thời gian gửi tin nhắn
                };
                // Gửi tin nhắn đến endpoint "/app/private-message" qua stompClient
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                // Thêm tin nhắn vào danh sách tin nhắn riêng tư
                addMessageToPrivateChat(chatMessage);
                // Cập nhật lại userData để xóa nội dung tin nhắn sau khi gửi
                setUserData({ ...userData, message: "" });
            } catch (error) {
                // Bắt lỗi và in ra console nếu có lỗi xảy ra khi gửi tin nhắn riêng
                console.error("Lỗi khi gửi tin nhắn riêng:", error);
            }
        }
    };

    // phần tên người dùng
    const handleUsername = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, username: value });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn ngừa gửi form hoặc thêm dòng mới
            if (tab === "CHATROOM") {
                sendValue(userData.message);  // Truyền message từ userData
            } else {
                sendPrivateValue(userData.message);  // Truyền message từ userData
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
                // <div className="register">
                //     <input
                //         className='name-input'
                //         id="user-name"
                //         placeholder="Nhập tên của bạn"
                //         name="userName"
                //         value={userData.username}
                //         onChange={handleUsername}
                //         margin="normal"
                //     />
                //     <button className='re-btn' type="button" onClick={registerUser}>
                //         Tham gia
                //     </button>
                // </div>
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
                                onChange={handleUsername}
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
