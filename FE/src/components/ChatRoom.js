import React, { useRef, useState, useEffect } from 'react';
import ColNavbar from '../colnavbar/ColNavbar';
import MessageList from '../body/message/messagelist/MessageList';
import SendMessage from '../body/message/sendmessage/SendMessage';
import MessageInfor from '../body/message/messageinfor/MessageInfor';
import MemberList from '../body/member/MemberList';
import FilterBar from '../body/filterbar/FilterMenu';
import ChatTool from '../body/chattool/ChatTool';
import CallDialog from './calldialog/CallDialog';
import { Input, Button } from 'antd';
import { loadMessagesFromServer, loadChatHistory, sendMessageToServer, fetchUsersBySource, connectToWebSocket, onUserConnected } from '../services/api';


const onSearch = (value, _e, info) => console.log(info?.source, value);

const baseUrl = process.env.REACT_APP_BASE_URL;

const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(() => new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab, setTab] = useState("CHATROOM");
    const [loginType, setLoginType] = useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
    });

    const endOfMessagesRef = useRef(null);

    const stompClientRef = useRef(null);

    const [isUpdatedAsc, setIsUpdatedAsc] = useState(true);
    const [isCuuNhatActive, setIsCuuNhatActive] = useState(false);

    const [isJoined, setIsJoined] = useState(false);

    const [currentCustomer, setCurrentCustomer] = useState({ name: '', avatar: '', color: '' });
    const [avatarColors, setAvatarColors] = useState({});

    const [source, setSource] = useState(null);

    const [joinedMembers, setJoinedMembers] = useState(new Map());

    const [members, setMembers] = useState([]);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const getAvatar = (name) => {
        return null;
    };

    const toggleUpdateOrder = () => {
        setIsUpdatedAsc(!isUpdatedAsc);
    };

    const toggleCuuNhat = () => {
        setIsCuuNhatActive(!isCuuNhatActive);
    };
    
    useEffect(() => {
        if (userData.connected) {
            loadMessagesFromServer(userData.username)
                .then(data => {
                    setPublicChats(data.publicMessages);
                    setPrivateChats(data.privateMessages);
                })
                .catch(error => console.error("Lỗi khi tải tin nhắn từ server: ", error));
        }
    }, [userData.connected, userData.username]); 

    useEffect(() => {
        if (userData.connected) {
            loadChatHistory(userData.username, "Chat chung")
                .then(data => {
                    setPublicChats(data);
                })
                .catch(error => console.error("Lỗi khi tải lịch sử chat từ server: ", error));
        }
    }, [userData.connected, userData.username]);

    const connect = () => {
        connectToWebSocket(stompClientRef, onConnected, onError);
    };

    const onConnected = () => {
        onUserConnected(stompClientRef, userData, onMessageReceived, onPrivateMessage);
        setUserData({ ...userData, connected: true });
    };

    const onMessageReceived = (payload) => {
        try {
            var payloadData = JSON.parse(payload.body);

            payloadData.fileUrl = payloadData.fileUrl || '';
            payloadData.fileName = payloadData.fileName || '';
            payloadData.fileType = payloadData.fileType || 'text';

            switch(payloadData.status) {
                case "JOIN":
                    if (!privateChats.get(payloadData.senderName)) {
                        privateChats.set(payloadData.senderName, []);
                        setPrivateChats(new Map(privateChats));
                    }
                    break;

                case "MESSAGE":
                    if (payloadData.receiverName === "Chat chung") {
                        setPublicChats(prevPublicChats => 
                            [...prevPublicChats, payloadData].sort((a, b) => new Date(a.time) - new Date(b.time))
                        );
                    } else {
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
        console.log("Lỗi kết nối WebSocket:", err);
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            const files = selectedFiles.map(fileObj => fileObj.file);
            if (tab === "CHATROOM") {
                sendValue(userData.message, files);
            } else {
                sendPrivateValue(userData.message, files);
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
                    const response = await sendMessageToServer(userData.username, "Chat chung", message, files[0]);
                    
                    const relativePath = response.data.fileUrl.replace(/^.*[\\/]/, '');
                    fileUrl = `${baseUrl}/uploads/${relativePath}`;
                    fileName = files[0].name;
                    fileType = files[0].type;
                }

                const chatMessage = {
                    senderName: userData.username,
                    receiverName: "Chat chung",
                    message: message || "",
                    status: "MESSAGE",
                    fileType: fileType,
                    fileUrl: fileUrl,
                    time: new Date().toISOString()
                };

                stompClientRef.current.send("/app/message/public", {}, JSON.stringify(chatMessage));
                setPublicChats(prevPublicChats => [...prevPublicChats, { ...chatMessage, fileName }]);

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
                    // Gửi file lên server và lấy URL
                    const response = await sendMessageToServer(userData.username, tab, message, files[0]);

                    const relativePath = response.data.fileUrl.replace(/^.*[\\/]/, '');
                    fileUrl = `${baseUrl}/uploads/${relativePath}`;
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
                    time: new Date().toISOString() // Sử dụng toISOString để có cả ngày và giờ
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

    const handleJoin = (memberName) => {
        setJoinedMembers(prev => new Map(prev).set(memberName, true)); // Cập nhật trạng thái tham gia cho thành viên
        if (memberName === tab) {
            setIsJoined(true); // Cập nhật trạng thái isJoined khi tab hiện tại được tham gia

            // Thêm tin nhắn hệ thống thông báo người dùng đã tham gia
            const systemMessage = {
                senderName: 'System',
                message: `${userData.username} đã tham gia cuộc hội thoại.`,
                time: new Date().toISOString(),
                status: 'SYSTEM'
            };

            if (tab === "CHATROOM") {
                setPublicChats(prevPublicChats => [...prevPublicChats, systemMessage]);
            } else {
                setPrivateChats(prevChats => {
                    const newChats = new Map(prevChats);
                    const chatList = newChats.get(tab) || [];
                    newChats.set(tab, [...chatList, systemMessage]);
                    return newChats;
                });
            }
        }
    };

    const handleTransfer = (memberName) => {
        setJoinedMembers(prev => new Map(prev).set(memberName, false)); // Cập nhật trạng thái chưa tham gia cho thành viên
        if (memberName === tab) {
            setIsJoined(false); // Cập nhật trạng thái isJoined khi tab hiện tại bị chuyển
        }
    };

    const handleSetTab = (name, color, source) => {
        setTab(name);
        setSource(source); // Cập nhật nguồn khi chọn tab
        const avatar = getAvatar(name);
        setCurrentCustomer({ name, avatar, color });
        setIsFilterCleared(false);
    };

    const handleSetAvatarColors = (colors) => {
        setAvatarColors(colors);
    };

    useEffect(() => {
        const loadUsers = async () => {
            if (source) {
                const users = await fetchUsersBySource(source);
                // TODO: Xử lý dữ liệu người dùng từ API thực tế
                // Ví dụ: const newPrivateChats = new Map(users.map(user => [user.name, user.messages]));
                const newPrivateChats = new Map(users.map(user => [user, []])); // Giả lập dữ liệu
                setPrivateChats(newPrivateChats);
            } else {
                // Nếu không có source, hiển thị tất cả
                setPrivateChats(new Map()); // Hoặc giữ nguyên dữ liệu hiện tại
            }
        };

        loadUsers();
    }, [source]);

    return (
        <div className="container">
            {userData.connected ? (
                <div className="container-1">
                    <div className="body-nav">
                        <div className="body-col-nav">
                            <div className="col-nav">
                                <ColNavbar 
                                    setTab={handleSetTab} 
                                    handleResetFilter={handleResetFilter} 
                                    setLoginType={setLoginType} 
                                    setSource={setSource} 
                                    setMembers={setMembers} 
                                    baseUrl={baseUrl} // Truyền baseUrl vào ColNavbar
                                />
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
                                                <span 
                                                    style={{ 
                                                        fontSize: '12px', 
                                                        transform: 'scale(1, 0.6)', 
                                                        color: isCuuNhatActive ? 'lightgray' : 'black' 
                                                    }}
                                                >
                                                    &#9650;
                                                </span> {/* Mũi tên lên */}
                                                <span 
                                                    style={{ 
                                                        fontSize: '12px', 
                                                        transform: 'scale(1, 0.6)', 
                                                        marginTop: '-8px', 
                                                        color: isCuuNhatActive ? 'black' : 'lightgray' 
                                                    }}
                                                >
                                                    &#9660;
                                                </span> {/* Mũi tên xuống */}
                                            </span>
                                        </span>
                                    </div>

                                    <div className='member-box'>
                                        <div className='member-list'>
                                            <MemberList 
                                                privateChats={privateChats} 
                                                setTab={handleSetTab} 
                                                tab={tab} 
                                                userData={userData} 
                                                setAvatarColors={handleSetAvatarColors} 
                                                source={source} 
                                                members={members} // Truyền danh sách thành viên vào MemberList
                                            />
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
                                                        <MessageInfor currentCustomer={currentCustomer} userData={userData} />
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
                                                                chats={tab === "CHATROOM" ? publicChats : (privateChats?.get(tab) || [])} 
                                                                tab={tab} userData={userData} endOfMessagesRef={endOfMessagesRef} avatarColors={avatarColors}
                                                            />
                                                            {!joinedMembers.get(tab) && (
                                                                <div style={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    marginTop: '10px',
                                                                }}>
                                                                    <Button 
                                                                        type="primary" 
                                                                        onClick={() => handleJoin(tab)} 
                                                                        style={{ 
                                                                            width: 'fit-content',
                                                                        }}
                                                                    >
                                                                        Tham gia
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {joinedMembers.get(tab) && (
                                                            <div style={{
                                                                backgroundColor: 'white',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                flexDirection: 'column',
                                                            }}>
                                                                <SendMessage 
                                                                    userData={userData} 
                                                                    handleMessage={handleMessage} 
                                                                    handleKeyPress={handleKeyPress} 
                                                                    sendValue={sendValue} 
                                                                    sendPrivateValue={sendPrivateValue} 
                                                                    tab={tab} 
                                                                />
                                                                <Button 
                                                                    type="default" 
                                                                    onClick={() => handleTransfer(tab)} 
                                                                    style={{ 
                                                                        marginTop: '10px',
                                                                        backgroundColor: '#0ec50e',
                                                                        color: 'white',
                                                                    }}
                                                                >
                                                                    Chuyển nhân viên phụ trách
                                                                </Button>
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
                                                    isJoined={joinedMembers.get(tab)} // Sử dụng trạng thái tham gia của tab hiện tại
                                                />
                                            </div>
                                        </div>
                                    </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <CallDialog members={members} />
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
                                onChange={handleUsername}
                            />
                            <button onClick={connect}>Kết nối</button> {/* Thay đổi nút để chỉ kết nối */}
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