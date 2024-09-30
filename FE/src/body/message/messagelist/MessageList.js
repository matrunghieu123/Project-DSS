import React, { useLayoutEffect } from 'react';
import { List, Avatar } from 'antd';
import './MessageList.css';
import ImageMessage from './imghanlde/ImageMessage';
import FileMessage from './filehandle/FileMessage';

const MessageList = ({ chats, userData, endOfMessagesRef, tab, avatarColors }) => {
    useLayoutEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chats, endOfMessagesRef, tab]);

    const renderFileContent = (fileUrl, fileType, fileName) => {
        if (fileType && fileType.startsWith('image/')) {
            return <ImageMessage src={fileUrl} alt="Sent image" />;
        } else if (fileType && fileType.startsWith('video/')) {
            return (
                <video controls width="250">
                    <source src={fileUrl} type={fileType} />
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            );
        } else if (fileUrl) {
            return <FileMessage fileUrl={fileUrl} fileType={fileType} fileName={fileName} />;
        }
        return null;
    };

    const shouldShowTime = (currentChat, previousChat) => {
        if (!previousChat) return true;
        const currentTime = new Date(currentChat.time).getTime();
        const previousTime = new Date(previousChat.time).getTime();
        return (currentTime - previousTime) >= 30 * 60 * 1000; // 30 phút
    };

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part[0]).join('');
        return initials.toUpperCase();
    };

    return (
        <List
            className="chat-messages"
            itemLayout="horizontal"
            dataSource={chats && chats.filter(chat => {
                if (tab === 'private') {
                    return (chat.senderName === userData.username || chat.receiverName === userData.username);
                }
                return true;
            })}
            renderItem={(chat, index) => {
                const previousChat = chats[index - 1];
                const isSameSender = previousChat && previousChat.senderName === chat.senderName;
                const showTime = shouldShowTime(chat, previousChat);

                return (
                    <List.Item
                        key={index}
                        className={`message ${chat.senderName === userData.username ? "self" : ""}`}
                        title={chat.time ? `Gửi lúc: ${chat.time}` : ''}
                    >
                        {!isSameSender && chat.senderName !== userData.username && (
                            <List.Item.Meta
                                avatar={
                                    <Avatar style={{ backgroundColor: avatarColors[chat.senderName] || '#7265e6' }}>
                                        {getInitials(chat.senderName)}
                                    </Avatar>
                                }
                                title={chat.senderName}
                                description={chat.time ? chat.time : 'Không rõ thời gian'}
                            />
                        )}
                        <div className="message-content-wrapper">
                            {(!isSameSender || showTime) && (
                                <div className="message-sender-time-wrapper">
                                    <span className="message-sender-time">{chat.senderName} - {chat.time}</span>
                                </div>
                            )}
                            <div className="message-content-inner">
                                <div className="message-data">
                                    <span className="message-content">{chat.message}</span>
                                    {chat.fileUrl && renderFileContent(chat.fileUrl, chat.fileType, chat.fileName)}
                                    <span className="message-time-hover">{chat.time}</span>
                                </div>
                            </div>
                        </div>
                        {!isSameSender && chat.senderName === userData.username && (
                            <Avatar
                                className="avatar self"
                                style={{ backgroundColor: avatarColors[chat.senderName] || '#7265e6' }}
                            >
                                {getInitials(chat.senderName)}
                            </Avatar>
                        )}
                    </List.Item>
                );
            }}
        >
            <div ref={endOfMessagesRef} />
        </List>
    );
};

export default React.memo(MessageList);