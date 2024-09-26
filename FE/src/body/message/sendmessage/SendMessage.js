import React, { useRef, useState } from 'react';
import './SendMessage.css';
import { FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa'; // Import icon từ react-icons

// Component SendMessage nhận các props: userData, handleMessage, handleKeyPress, sendValue, sendPrivateValue, tab
const SendMessage = ({ userData, handleMessage, handleKeyPress, sendValue, sendPrivateValue, tab }) => {
    const inputRef = useRef(null); // Tham chiếu đến trường nhập liệu
    const fileInputRef = useRef(null); // Tham chiếu đến trường input file
    const [selectedFiles, setSelectedFiles] = useState([]); // Trạng thái để lưu trữ tệp đã chọn

    // Hàm handleSend để xử lý việc gửi tin nhắn
    const handleSend = async () => {
        console.log("Sending message:", userData.message); // Kiểm tra xem tin nhắn có được gửi hay không
        console.log("Selected files:", selectedFiles); // Kiểm tra danh sách file

        // Kiểm tra nếu message hoặc file đã chọn có giá trị
        if (userData.message.trim() !== '' || selectedFiles.length > 0) {
            const files = selectedFiles.map(fileObj => fileObj.file);
            
            // Kiểm tra xem đang ở chế độ public hay private và gửi tương ứng
            if (tab === "CHATROOM") {
                await sendValue(userData.message, files);  // Gửi tin nhắn cho public chat
            } else {
                await sendPrivateValue(userData.message, files);  // Gửi tin nhắn cho private chat
            }
            
            // Xóa nội dung tin nhắn và file đã chọn sau khi gửi
            handleMessage({ target: { value: '' } });
            setSelectedFiles([]);  // Reset selectedFiles sau khi gửi
        }
    };

    // Hàm handleFileChange để xử lý khi người dùng chọn file
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }));
        setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    };

    // Hàm removeSelectedFile để xóa file đã chọn
    const removeSelectedFile = (index) => {
        setSelectedFiles(prevFiles => {
            const newFiles = [...prevFiles];
            URL.revokeObjectURL(newFiles[index].preview);
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    return (
        <div className="send-message-container">
            <div className="message-input-area">
                {selectedFiles.length > 0 && (
                    <div className="selected-files">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="selected-file">
                                {file.file.type.startsWith('image/') ? (
                                    <img src={file.preview} alt="selected" className="selected-image" />
                                ) : (
                                    <div className="selected-doc">
                                        <span>{file.file.name}</span>
                                        <span>({(file.file.size / 1024).toFixed(2)} KB)</span>
                                    </div>
                                )}
                                <button onClick={() => removeSelectedFile(index)} className="remove-file">
                                    <FaTimes />
                                </button>
                            </div>
                        ))}
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
                        multiple
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
