import axios from 'axios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { sendTelegramMessage, uploadTelegramFile, getTelegramMessages } from './TLapi';

const baseUrl = process.env.REACT_APP_BASE_URL;

/**
 * Tải tin nhắn từ server cho một người dùng cụ thể.
 * @param {string} username - Tên người dùng cần tải tin nhắn.
 * @returns {Promise<Object>} - Dữ liệu tin nhắn từ server.
 */
export const loadMessagesFromServer = async (username) => {
    if (!username) {
        console.error("Username is required to load messages.");
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/api/chat/public?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        // Kiểm tra và xử lý dữ liệu tin nhắn và file
        return data.map(message => ({
            ...message,
            fileUrl: message.fileUrl || '',
            fileName: message.fileName || '',
            fileType: message.fileType || 'text'
        }));
    } catch (error) {
        console.error("Lỗi khi tải tin nhắn từ server: ", error);
        throw error;
    }
};

/**
 * Tải lịch sử chat cho một người nhận cụ thể.
 * @param {string} receiverName - Tên người nhận.
 * @returns {Promise<Object>} - Dữ liệu lịch sử chat từ server.
 */
export const loadChatHistory = async (receiverName) => {
    try {
        const response = await fetch(`${baseUrl}/api/chat/public?receiverName=${receiverName}`);
        const data = await response.json();
        return data.map(message => ({
            ...message,
            fileUrl: message.fileUrl || '',
            fileName: message.fileName || '',
            fileType: message.fileType || 'text'
        }));
    } catch (error) {
        console.error("Lỗi khi tải lịch sử chat từ server: ", error);
        throw error;
    }
};

/**
 * Gửi tin nhắn và tệp đính kèm (nếu có) lên server.
 * @param {string} senderName - Tên người gửi.
 * @param {string} receiverName - Tên người nhận.
 * @param {string} messageText - Nội dung tin nhắn.
 * @param {File} [file] - Tệp đính kèm (tùy chọn).
 * @returns {Promise<Object>} - Phản hồi từ server sau khi gửi tin nhắn.
 */
export const sendMessageToServer = async (senderName, receiverName, messageText, file) => {
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
            url: `${baseUrl}/api/upload`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Message sent successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

/**
 * Lấy danh sách người dùng từ một nguồn cụ thể (Facebook, Zalo, Telegram, Viber).
 * @param {string} source - Nguồn người dùng (facebook, zalo, telegram, viber).
 * @returns {Promise<Array>} - Danh sách người dùng từ nguồn đã chọn.
 */
export const fetchUsersBySource = async (source) => {
    try {
        let response;
        switch (source) {
            case 'facebook':
                response = await fetch(`${baseUrl}/api/facebook/users`);
                break;
            case 'zalo':
                response = await fetch(`${baseUrl}/api/zalo/users`);
                break;
            case 'telegram':
                response = await fetch(`${baseUrl}/api/chat/telegram`);
                break;
            case 'viber':
                response = await fetch(`${baseUrl}/api/viber/users`);
                break;
            default:
                throw new Error('Nguồn không hợp lệ');
        }

        if (!response.ok) {
            throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data = await response.json();
        return data.users; // Giả sử API trả về danh sách người dùng trong thuộc tính 'users'
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        return []; // Trả về mảng rỗng nếu có lỗi
    }
};

/**
 * Kết nối đến WebSocket server.
 * @param {Object} stompClientRef - Tham chiếu đến stompClient.
 * @param {Function} onConnected - Hàm callback khi kết nối thành công.
 * @param {Function} onError - Hàm callback khi có lỗi kết nối.
 */
export const connectToWebSocket = (stompClientRef, onConnected, onError) => {
    let Sock = new SockJS(`${baseUrl}/ws`);
    stompClientRef.current = over(Sock);
    stompClientRef.current.connect({}, onConnected, onError);
    console.log("Đang cố gắng kết nối đến WebSocket");
};

/**
 * Thực hiện logic khi người dùng tham gia.
 * @param {Object} stompClientRef - Tham chiếu đến stompClient.
 * @param {Object} userData - Dữ liệu người dùng.
 * @param {Function} onMessageReceived - Hàm callback khi nhận được tin nhắn.
 * @param {Function} onPrivateMessage - Hàm callback khi nhận được tin nhắn riêng.
 */
export const onUserConnected = (stompClientRef, userData, onMessageReceived, onPrivateMessage) => {
    console.log("Đã kết nối đến WebSocket");
    console.log("User Data:", userData);
    stompClientRef.current.subscribe('/topic/public', onMessageReceived);
    stompClientRef.current.subscribe('/user/' + userData.username + '/private', onPrivateMessage);
    userJoin();
    loadMessagesFromServer(userData.username);
    loadChatHistory(userData.username, "Chat chung");
};

/**
 * Logic khi người dùng tham gia mà không gửi yêu cầu WebSocket.
 */
export const userJoin = () => {
    console.log("User join logic executed without WebSocket request.");
};

/**
 * Ví dụ sử dụng hàm sendTelegramMessage khi một sự kiện xảy ra.
 * @param {Object} message - Đối tượng tin nhắn cần gửi.
 */
export const handleEventAndSendTelegramMessage = async (message) => {
    try {
        const response = await sendTelegramMessage(message);
        console.log('Telegram message sent:', response);
    } catch (error) {
        console.error('Error sending Telegram message:', error);
    }
};

/**
 * Ví dụ sử dụng hàm uploadTelegramFile để tải lên một tệp.
 * @param {File} file - Tệp cần tải lên.
 */
export const handleFileUploadToTelegram = async (file) => {
    try {
        const response = await uploadTelegramFile(file);
        console.log('File uploaded to Telegram:', response);
    } catch (error) {
        console.error('Error uploading file to Telegram:', error);
    }
};

/**
 * Ví dụ sử dụng hàm getTelegramMessages để lấy tin nhắn.
 * @param {number} page - Số trang cần lấy.
 * @param {number} size - Số lượng tin nhắn trên mỗi trang.
 */
export const fetchTelegramMessages = async (page, size) => {
    try {
        const messages = await getTelegramMessages(page, size);
        console.log('Fetched Telegram messages:', messages);
        return messages;
    } catch (error) {
        console.error('Error fetching Telegram messages:', error);
    }
};
