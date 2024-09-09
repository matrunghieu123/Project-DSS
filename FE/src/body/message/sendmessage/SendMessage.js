import React, { useRef } from 'react';
import './SendMessage.css';

const SendMessage = ({ userData, handleMessage, handleKeyPress, sendValue, sendPrivateValue, tab }) => {
    const inputRef = useRef(null); // Tham chiếu đến trường nhập liệu

    const handleSend = () => {
        if (tab === "CHATROOM") {
            sendValue();
        } else {
            sendPrivateValue();
        }
        
        // Sau khi gửi tin nhắn, focus lại vào trường nhập liệu
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="send-message">
            <input
                ref={inputRef} // Gắn ref vào trường nhập liệu
                type="text"
                className="input-message"
                placeholder="Nhập tin nhắn"
                value={userData.message}
                onChange={handleMessage}
                onKeyDown={handleKeyPress}
            />
            <button
                type="button"
                className="send-button"
                onClick={handleSend} // Sử dụng hàm handleSend
            >
                Gửi
            </button>
        </div>
    );
};

export default SendMessage;
