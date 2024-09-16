import React, { useRef, useState } from 'react';
import './SendMessage.css';
import { FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa'; // Import icon từ react-icons

const SendMessage = ({ userData, handleMessage, handleKeyPress, sendValue, sendPrivateValue, tab }) => {
    const inputRef = useRef(null); // Tham chiếu đến trường nhập liệu
    const fileInputRef = useRef(null); // Tham chiếu đến trường input file
    const [selectedFile, setSelectedFile] = useState(null); // Trạng thái để lưu trữ tệp đã chọn

    const handleSend = () => {
        if (tab === "CHATROOM") {
            sendValue(selectedFile);
        } else {
            sendPrivateValue(selectedFile);
        }
        
        // Sau khi gửi tin nhắn, focus lại vào trường nhập liệu và xóa tệp đã chọn
        if (inputRef.current) {
            inputRef.current.focus();
        }
        setSelectedFile(null);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file); // Lưu trữ tệp đã chọn vào trạng thái
        console.log('Tệp đã chọn:', file);
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="send-message-container">
            <div className="message-input-area">
                {selectedFile && (
                    <div className="selected-file">
                        {selectedFile.type.startsWith('image/') ? (
                            <img src={URL.createObjectURL(selectedFile)} alt="selected" className="selected-image" />
                        ) : (
                            <div className="selected-doc">
                                <span>{selectedFile.name}</span>
                                <span>({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                            </div>
                        )}
                        <button onClick={removeSelectedFile} className="remove-file">
                            <FaTimes />
                        </button>
                    </div>
                )}
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
            </div>
        </div>
    );
};

export default SendMessage;
