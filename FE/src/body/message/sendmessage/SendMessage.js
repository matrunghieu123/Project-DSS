import React, { useRef } from 'react';
import './SendMessage.css';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa'; // Import icon từ react-icons

const SendMessage = ({ userData, handleMessage, handleKeyPress, sendValue, sendPrivateValue, tab }) => {
    const inputRef = useRef(null); // Tham chiếu đến trường nhập liệu
    const fileInputRef = useRef(null); // Tham chiếu đến trường input file

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Bạn có thể xử lý tệp đã chọn ở đây (ví dụ: gửi tệp lên server)
        console.log('Tệp đã chọn:', file);
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

            {/* Nút tải lên file */}
            <button
                type="button"
                className="file-button"
                onClick={() => fileInputRef.current.click()} // Mở hộp thoại chọn tệp khi nhấn nút
            >
                <FaPaperclip />
            </button>
            <input
                ref={fileInputRef} // Gắn ref vào input file
                type="file"
                style={{ display: 'none' }} // Ẩn input file
                onChange={handleFileChange}
            />

            {/* Nút gửi với icon */}
            <button
                type="button"
                className="send-button"
                onClick={handleSend} // Sử dụng hàm handleSend
            >
                <FaPaperPlane />
            </button>
        </div>
    );
};

export default SendMessage;
