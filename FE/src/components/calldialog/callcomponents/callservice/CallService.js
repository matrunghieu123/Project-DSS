import { notification, Modal, Spin } from 'antd';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { getAuthToken, getCallRecord } from '../../../../services/api';
import JsSIPService from '../../../../services/call_api/JsSIPService';

// Hàm tiện ích để ghi log trạng thái kết nối
const logConnectionStatus = (status) => {
  console.log('Connection status:', status);
};

// Component quản lý giao diện cuộc gọi
const CallModal = ({ startTime, inputNumber, closeModal }) => {
  const [duration, setDuration] = useState(0);
  const [connecting, setConnecting] = useState(true);
  const sessionRef = useRef(null);

  const onCallAccepted = useCallback(async (token) => {
    setConnecting(false);
    notification.success({
      message: 'Kết nối thành công',
      description: `Đã kết nối với ${inputNumber}`,
    });
    await getCallRecord(token);
  }, [inputNumber]);

  const onCallEnded = useCallback(() => {
    notification.info({ message: 'Cuộc gọi đã kết thúc' });
    closeModal();
  }, [closeModal]);

  const onCallFailed = useCallback((e) => {
    console.error('Cuộc gọi thất bại:', e);
    const message = e?.message?.data || 'Không xác định';
    const cause = e.cause || 'Lỗi không xác định';
    notification.error({
      message: 'Lỗi kết nối',
      description: `Cuộc gọi thất bại: ${cause}. Chi tiết: ${message}`,
    });
    closeModal();
  }, [closeModal]);

  // Cập nhật thời gian gọi
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDuration(Math.floor((new Date() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [startTime]);

  // Khởi tạo cuộc gọi với JsSIP
  useEffect(() => {
    const initiateCall = async () => {
      try {
        const clientId = 85;
        const orgId = '105';
        const token = await getAuthToken(clientId, orgId);
  
        if (!token) throw new Error('Không thể lấy token xác thực.');
  
        const sipServer = process.env.REACT_APP_SIP_SERVER;
        const socketUrl = process.env.REACT_APP_SIP_SOCKET_URL;
        const username = process.env.REACT_APP_SIP_USERNAME;
        const password = process.env.REACT_APP_SIP_PASSWORD;
  
        if (!sipServer || !socketUrl || !username || !password) {
          throw new Error('Thiếu thông tin cấu hình SIP.');
        }
  
        const extension = inputNumber.startsWith('+')
          ? inputNumber
          : `+84${inputNumber.slice(1)}`;
  
        const jsSIPService = new JsSIPService(extension, password, sipServer, socketUrl);
  
        // Sử dụng các callback
        jsSIPService.onConnectionStatusChanged((status) => {
          logConnectionStatus(status);
          if (status === 'connected') {
            onCallAccepted(token); // Sử dụng callback khi kết nối thành công
          } else if (status === 'ended') {
            onCallEnded(); // Sử dụng callback khi cuộc gọi kết thúc
          } else if (status === 'failed') {
            onCallFailed(new Error('Cuộc gọi thất bại')); // Sử dụng callback khi cuộc gọi thất bại
          }
        });
  
        jsSIPService.makeCall(`sip:${extension}@${sipServer}`);
  
        sessionRef.current = jsSIPService.coolPhone;
      } catch (error) {
        notification.error({ message: 'Lỗi', description: error.message });
        closeModal();
      }
    };
  
    initiateCall();
  
    return () => {
      if (sessionRef.current && sessionRef.current.isInProgress()) {
        sessionRef.current.terminate();
      }
    };
  }, [inputNumber, closeModal, onCallAccepted, onCallEnded, onCallFailed]);  

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const startTimeString = startTime.toLocaleTimeString();

  return (
    <Modal
      title="Đang gọi..."
      open={true}
      onCancel={() => {
        if (sessionRef.current && sessionRef.current.isInProgress()) {
          sessionRef.current.terminate();
        }
        closeModal();
      }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={() => {
              if (sessionRef.current && sessionRef.current.isInProgress()) {
                sessionRef.current.terminate();
              }
              closeModal();
            }}
            style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}
          >
            Huỷ
          </button>
          <button
            onClick={closeModal}
            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px' }}
          >
            OK
          </button>
        </div>
      }
    >
      {connecting ? (
        <Spin tip="Đang kết nối...">
          <p>Vui lòng đợi trong giây lát...</p>
        </Spin>
      ) : (
        <>
          <div>Bắt đầu: {startTimeString}</div>
          <div>Đang gọi đến số {inputNumber}</div>
          <div>Thời gian: {minutes} phút {seconds} giây</div>
        </>
      )}
    </Modal>
  );
};

let root;

// Hàm gọi được sử dụng để tạo và hiển thị modal cuộc gọi
export const handleCall = async (inputNumber) => {
  const phoneRegex = /^[0-9]{9,11}$/;

  if (!phoneRegex.test(inputNumber)) {
    return notification.error({ message: 'Lỗi', description: 'Số điện thoại không hợp lệ' });
  }

  const startTime = new Date();

  const closeModal = () => {
    if (root) {
      root.unmount();
      const modalContainer = document.getElementById('call-modal-container');
      if (modalContainer) {
        document.body.removeChild(modalContainer);
      }
      root = null;
    }
  };

  let modalContainer = document.getElementById('call-modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'call-modal-container';
    document.body.appendChild(modalContainer);
  }

  if (!root) {
    root = createRoot(modalContainer);
  }

  try {
    const sipServer = process.env.REACT_APP_SIP_SERVER;
    const socketUrl = process.env.REACT_APP_SIP_SOCKET_URL;
    const username = process.env.REACT_APP_SIP_USERNAME;
    const password = process.env.REACT_APP_SIP_PASSWORD;

    if (!sipServer || !socketUrl || !username || !password) {
      throw new Error('Thiếu thông tin cấu hình SIP.');
    }

    const jsSIPService = new JsSIPService(inputNumber, password, sipServer, socketUrl);

    jsSIPService.onConnectionStatusChanged((status) => {
      logConnectionStatus(status); // Sử dụng hàm tiện ích
      if (status === 'registered') {
        const extension = inputNumber.startsWith('+')
          ? inputNumber
          : `+84${inputNumber.slice(1)}`;

        jsSIPService.makeCall(`sip:${extension}@${sipServer}`);
      } else if (status === 'ended' || status === 'failed') {
        closeModal();
      }
    });

    jsSIPService.onRegister(() => {
      logConnectionStatus('Registered successfully.'); // Ghi log khi đăng ký thành công
    });

    root.render(<CallModal startTime={startTime} inputNumber={inputNumber} closeModal={closeModal} />);
  } catch (error) {
    notification.error({ message: 'Lỗi', description: error.message });
    closeModal();
  }
};
