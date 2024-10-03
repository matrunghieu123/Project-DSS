import React, { useRef, useState, useEffect } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import ColNavbar from '../colnavbar/ColNavbar';
import MessageList from '../body/message/messagelist/MessageList';
import SendMessage from '../body/message/sendmessage/SendMessage';
import MessageInfor from '../body/message/messageinfor/MessageInfor';
import MemberList from '../body/member/MemberList';
import FilterBar from '../body/filterbar/FilterMenu';
import ChatTool from '../body/chattool/ChatTool';
import CallDialog from './calldialog/CallDialog';
import { Input, Button } from 'antd';
import { auth } from '../firebase/FireBase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from 'axios';


const onSearch = (value, _e, info) => console.log(info?.source, value);

let baseUrl = 'http://192.168.1.12:81'; // Biến toàn cục để lưu URL gốc

const setBaseUrl = (url) => {
    baseUrl = url;
};

// Sử dụng hàm setBaseUrl để thiết lập URL gốc
setBaseUrl('http://192.168.1.12:81');

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

    // const storage = getStorage();

    const [isUpdatedAsc, setIsUpdatedAsc] = useState(true); // State để theo dõi trạng thái mũi tên
    const [isCuuNhatActive, setIsCuuNhatActive] = useState(false); // State để theo dõi trạng thái "Cũ nhất"

    const [isJoined, setIsJoined] = useState(false); // Thêm trạng thái tham gia

    const [avatar, setAvatar] = useState(null); // Thêm state để quản lý ảnh đại diện

    const [currentCustomer, setCurrentCustomer] = useState({ name: '', avatar: '', color: '' });
    const [avatarColors, setAvatarColors] = useState({});

    // Hàm để lấy avatar
    const getAvatar = (name) => {
        // Lấy URL từ database hoặc API
        return null; // Trả về null để sử dụng avatar mặc định của Ant Design
    };

    const toggleUpdateOrder = () => {
        setIsUpdatedAsc(!isUpdatedAsc); // Đảo ngược trạng thái
    };

    const toggleCuuNhat = () => {
        setIsCuuNhatActive(!isCuuNhatActive); // Đảo ngược trạng thái "Cũ nhất"
    };

    // const uploadFileToFirebase = async (file) => {
    //     try {
    //         const storageRef = ref(storage, `uploads/${file.name}`);
    //         const snapshot = await uploadBytes(storageRef, file);
    //         const downloadURL = await getDownloadURL(snapshot.ref);
    //         return downloadURL; // Trả về URL để hiển thị trong tin nhắn
    //     } catch (error) {
    //         console.error("Lỗi khi tải lên Firebase Storage:", error);
    //         return null; // Nếu có lỗi thì trả về null
    //     }
    // };

    const loadMessagesFromServer = async (username) => {
        if (!username) {
            console.error("Username is required to load messages.");
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/chat/history?username=${encodeURIComponent(username)}`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const text = await response.text();
            if (!text) {
                throw new Error("Empty response from server");
            }

            const data = JSON.parse(text);
            // Xử lý dữ liệu nhận được từ server
            setPublicChats(data.publicMessages);
            setPrivateChats(data.privateMessages);
        } catch (error) {
            console.error("Lỗi khi tải tin nhắn từ server: ", error);
        }
    };

    const loadChatHistory = async (senderName, receiverName) => {
        try {
            const response = await fetch(`${baseUrl}/api/chat/history?senderName=${senderName}&receiverName=${receiverName}`);
            const data = await response.json();
            // Xử lý dữ liệu nhận được từ server
            if (receiverName === "chat tổng") {
                setPublicChats(data);
            } else {
                setPrivateChats(prevChats => {
                    const newChats = new Map(prevChats);
                    newChats.set(receiverName, data);
                    return newChats;
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải lịch sử chat từ server: ", error);
        }
    };

    // Thay thế loadMessagesFromFirestore bằng loadMessagesFromServer
    useEffect(() => {
        if (userData.connected) {
            loadMessagesFromServer(userData.username);
        }
    }, [userData.connected, userData.username]); // Thêm userData.username vào mảng phụ thuộc

    useEffect(() => {
        if (userData.connected) {
            loadChatHistory(userData.username, "chat tổng");
        }
    }, [userData.connected, userData.username]);

    useEffect(() => {
        // Thêm các tab chat riêng tư clone
        const initialPrivateChats = new Map();
        initialPrivateChats.set('user1', []);
        initialPrivateChats.set('user2', []);
        setPrivateChats(initialPrivateChats);
    }, []);
    // Hàm đăng nhập Firebase
    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Đăng nhập thành công:", user);
                // Sử dụng tên người dùng nhập thay vì email
                const username = userData.username; // Lấy username từ dữ liệu người dùng nhập
                setUserData({ ...userData, username, avatar, connected: true });
                setTab(username); // Đặt tab thành tên người dùng vừa đăng nhập
                loadMessagesFromServer(username); // Thêm dòng này để tải tin nhắn ngay sau khi đăng nhập
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
                setUserData({ ...userData, username, avatar, connected: true });
                setTab(username); // Đặt tab thành tên người dùng vừa đăng ký
                loadMessagesFromServer(username); // Thêm dòng này để tải tin nhắn ngay sau khi đăng ký
                connect();
            })
            .catch((error) => {
                console.error("Đăng ký thất bại:", error.message);
            });
    };

    const connect = () => {
        let Sock = new SockJS(`${baseUrl}/ws`); // Sử dụng URL gốc để kết nối WebSocket
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
        loadMessagesFromServer(userData.username); // Thêm dòng này để tải tin nhắn ngay sau khi kết nối
        loadChatHistory(userData.username, "chat tổng");
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
        console.log("Lỗi kết nối WebSocket:", err); // Thêm log để kiểm tra lỗi kết nối
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

    // Hàm sendMessageToServer để gửi tin nhắn đến server BE
    const sendMessageToServer = async (senderName, receiverName, messageText, file) => {
        const formData = new FormData();
        formData.append('senderName', senderName);
        formData.append('receiverName', receiverName);
        formData.append('message', messageText);
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await axios({
                method: 'post',
                url: `${baseUrl}/api/upload`, // Sử dụng baseUrl
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Message sent successfully:', response.data);
            return response; // Trả về phản hồi từ server
        } catch (error) {
            console.error('Error sending message:', error);
            throw error; // Ném lỗi để xử lý ở nơi gọi hàm
        }
    };

    // Hàm sendValue để gửi tin nhắn công khai
    const sendValue = async (message, files = []) => {
        if (stompClientRef.current && (message.trim() !== '' || files.length > 0)) {
            try {
                let fileUrl = null;
                let fileName = null;  // Biến cục bộ để lưu tên file
                let fileType = null;

                if (files.length > 0) {
                    // Gửi file lên server và lấy URL
                    const response = await sendMessageToServer(userData.username, "chat tổng", message, files[0]);
                    fileUrl = `${baseUrl}/api/${response.data.fileUrl}`; // Thay đổi giá trị fileUrl
                    fileName = files[0].name;  // Lưu tên file vào biến cục bộ
                    fileType = files[0].type;
                }

                const chatMessage = {
                    senderName: userData.username,
                    receiverName: "chat tổng",
                    message: message || "",
                    status: "MESSAGE",
                    fileType: fileType,
                    fileUrl: fileUrl,
                    time: new Date().toLocaleTimeString()
                };

                // Gửi tin nhắn ngay lập tức mà không chờ phản hồi từ server
                stompClientRef.current.send("/app/message", {}, JSON.stringify(chatMessage));
                setPublicChats(prevPublicChats => [...prevPublicChats, { ...chatMessage, fileName }]);  // Thêm fileName vào tin nhắn hiển thị

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
                let fileName = null;  // Biến cục bộ để lưu tên file
                let fileType = null;

                if (files.length > 0) {
                    // Gửi file lên server và lấy URL
                    const response = await sendMessageToServer(userData.username, tab, message, files[0]);
                    fileUrl = `${baseUrl}${response.data.fileUrl}`; // Thay đổi giá trị fileUrl
                    fileName = files[0].name;  // Lưu tên file vào biến cục bộ
                    fileType = files[0].type;
                }

                const chatMessage = {
                    senderName: userData.username,
                    receiverName: tab,
                    message: message || "",
                    status: "MESSAGE",
                    fileType: fileType,
                    fileUrl: fileUrl,
                    time: new Date().toLocaleTimeString()
                };

                stompClientRef.current.send("/app/private-message", {}, JSON.stringify(chatMessage));
                addMessageToPrivateChat({ ...chatMessage, fileName });  // Thêm fileName vào tin nhắn hiển thị
                setUserData({ ...userData, message: "" });
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        }
    };


    // Thêm trạng thái mới
    const [isFilterCleared, setIsFilterCleared] = useState(true); // Mặc định là true để hiển thị màn hình rỗng khi mới đăng nhập

    // Hàm xử lý khi nhấn vào icon xóa bộ lọc
    const handleClearFilter = () => {
        setIsFilterCleared(true);
    };

    // Hàm để quay lại trạng thái bình thường
    const handleResetFilter = () => {
        setIsFilterCleared(false);
    };

    const handleJoin = () => {
        setIsJoined(true); // Cập nhật trạng thái tham gia
    };

    const handleSetTab = (name, color) => {
        setTab(name);
        const avatar = getAvatar(name); // Lấy avatar từ hàm getAvatar
        setCurrentCustomer({ name, avatar, color });
        setIsFilterCleared(false); // Khi chọn tab, đặt isFilterCleared thành false để hiển thị nội dung chat
    };

    const handleSetAvatarColors = (colors) => {
        setAvatarColors(colors);
    };

    return (
        <div className="container">
            {userData.connected ? (
                <div className="container-1">
                    <div className="body-nav">
                        <div className="body-col-nav">
                            <div className="col-nav">
                                <ColNavbar setTab={handleSetTab} handleResetFilter={handleResetFilter} setLoginType={setLoginType} />
                            </div>
                        </div>

                        <div className="chat-box-body">
                            <div className="chat-box">
                                <div className='member-search'>
                                    <div className='search-box'>
                                        <Input.Search
                                            className='search-button'
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onSearch={onSearch}
                                            size='large'
                                            style={{ borderRadius: '4px', borderColor: '#d9d9d9' }} // Thay đổi kiểu dáng
                                        />
                                    </div>

                                    {/* Thêm thanh tìm kiếm mới ở trên member list */}
                                    <div className='search-box'>
                                        <Input.Search
                                            className='search-button'
                                            placeholder="Tìm kiếm từ ngày đến ngày ..."
                                            allowClear
                                            size='large'
                                            style={{ borderRadius: '4px', borderColor: '#d9d9d9' }} // Thay đổi kiểu dáng
                                        />
                                    </div>

                                    {/* Thêm phần thời gian cập nhật và cũ nhất */}
                                    <div 
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center', 
                                            marginBottom: '8px', 
                                            margin: '16px',
                                        }}
                                    >
                                        <span onClick={toggleUpdateOrder} style={{ cursor: 'pointer' }}>
                                            Thời gian cập nhật 
                                            <span style={{ marginLeft: '5px', fontSize: '12px' }}>
                                                {isUpdatedAsc ? '▼' : '▲'} 
                                            </span>
                                        </span>
                                        <span 
                                            onClick={toggleCuuNhat} 
                                            style={{ 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center',
                                            }}
                                        >
                                            {isCuuNhatActive ? 'Mới nhất' : 'Cũ nhất'} {/* Thay đổi chữ hiển thị */}
                                            <span 
                                                style={{ 
                                                    marginLeft: '5px', 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    alignItems: 'center', 
                                                    color: isCuuNhatActive ? 'lightgray' : 'black' // Thay đổi màu sắc
                                                }}
                                            >
                                                <span style={{ fontSize: '12px', transform: 'scale(1, 0.6)', color: isCuuNhatActive ? 'lightgray' : 'black' }}>&#9650;</span> {/* Mũi tên lên */}
                                                <span style={{ fontSize: '12px', transform: 'scale(1, 0.6)', marginTop: '-8px', color: isCuuNhatActive ? 'black' : 'lightgray' }}>&#9660;</span> {/* Mũi tên xuống */}
                                            </span>
                                        </span>
                                    </div>

                                    <div className='member-box'>
                                        <div className='member-list'>
                                            <MemberList privateChats={privateChats} setTab={handleSetTab} tab={tab} userData={userData} setAvatarColors={handleSetAvatarColors} />
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
                                                        <MessageInfor currentCustomer={currentCustomer} />
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
                                                                tab={tab} userData={userData} endOfMessagesRef={endOfMessagesRef} avatarColors={avatarColors}
                                                            />
                                                            {!isJoined && ( // Hiển thị nút "Tham gia" nếu chưa tham gia
                                                                <Button type="primary" onClick={handleJoin} style={{ marginTop: '10px' }}>
                                                                    Tham gia
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {isJoined && ( // Chỉ hiển thị SendMessage nếu đã tham gia
                                                            <div style={{
                                                                backgroundColor: 'white',
                                                            }}>
                                                                <SendMessage 
                                                                    userData={userData} 
                                                                    handleMessage={handleMessage} 
                                                                    handleKeyPress={handleKeyPress} 
                                                                    sendValue={sendValue} 
                                                                    sendPrivateValue={sendPrivateValue} 
                                                                    tab={tab} 
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='chat-tool-wrapper'>
                                            <div className='chat-tool-body'>
                                                <ChatTool 
                                                    avatar={userData.username[0].toUpperCase()}  // Truyền ký tự đầu tiên của username làm avatar
                                                    userName={userData.username}  // Truyền username 
                                                    isJoined={isJoined}
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