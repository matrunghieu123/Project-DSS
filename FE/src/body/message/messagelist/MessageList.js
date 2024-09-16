import React, { useLayoutEffect } from 'react';
import './MessageList.css';
import ImageMessage from './imghanlde/ImageMessage';

// Component MessageList nhận các props: chats (danh sách tin nhắn), userData (dữ liệu người dùng), endOfMessagesRef (tham chiếu đến phần tử cuối cùng của danh sách tin nhắn)
const MessageList = ({ chats, userData, endOfMessagesRef }) => {

    // useLayoutEffect để cuộn tới cuối danh sách tin nhắn mỗi khi danh sách tin nhắn hoặc endOfMessagesRef thay đổi
    useLayoutEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats, endOfMessagesRef]);

    // Hàm renderFileContent để hiển thị nội dung file (hình ảnh hoặc file khác)
    const renderFileContent = (file) => {
        if (file && file.type && file.type.startsWith('image/')) {
            // Nếu file là hình ảnh, sử dụng component ImageMessage để hiển thị
            return <ImageMessage src={file.data || URL.createObjectURL(file)} alt="Sent image" />;
        } else if (file) {
            // Nếu file không phải là hình ảnh, hiển thị link để tải về
            return <a href={file.data || URL.createObjectURL(file)} download={file.name}>{file.name}</a>;
        }
        return null;
    };

    return (
        <ul className="chat-messages">
            {chats && chats.map((chat, index) => {
                const previousChat = chats[index - 1];
                const isSameSender = previousChat && previousChat.senderName === chat.senderName;

                return (
                    <li
                        className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                        key={index}
                    >
                        {/* Hiển thị avatar nếu tin nhắn không phải của cùng một người gửi liên tiếp và không phải của người dùng hiện tại */}
                        {!isSameSender && chat.senderName !== userData.username && (
                            <img
                                className="message-avatar"
                                src={chat.avatar || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'}
                                alt="avatar"
                                style={{ backgroundColor: 'black', color: 'white' }}
                            />
                        )}
                        {/* Hiển thị placeholder nếu tin nhắn là của cùng một người gửi liên tiếp và không phải của người dùng hiện tại */}
                        {isSameSender && chat.senderName !== userData.username && (
                            <div className="message-avatar-placeholder"></div>
                        )}
                        <div className="message-data">
                            {/* Hiển thị nội dung tin nhắn */}
                            <span className="message-content">{chat.message}</span>
                            {/* Hiển thị nội dung file nếu có */}
                            {chat.file && renderFileContent(chat.file)}
                            {/* Hiển thị thời gian gửi tin nhắn */}
                            <span className="message-time">{chat.time}</span>
                        </div>
                        {/* Hiển thị avatar nếu tin nhắn không phải của cùng một người gửi liên tiếp và là của người dùng hiện tại */}
                        {!isSameSender && chat.senderName === userData.username && (
                            <img
                                className="avatar self"
                                src={chat.avatar || 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'}
                                alt="avatar"
                                style={{ backgroundColor: 'black', color: 'white' }}
                            />
                        )}
                        {/* Hiển thị placeholder nếu tin nhắn là của cùng một người gửi liên tiếp và là của người dùng hiện tại */}
                        {isSameSender && chat.senderName === userData.username && (
                            <div className="avatar-placeholder self"></div>
                        )}
                    </li>
                );
            })}
            {/* Phần tử để cuộn tới cuối */}
            <div ref={endOfMessagesRef} />
        </ul>
    );
};

export default React.memo(MessageList);
