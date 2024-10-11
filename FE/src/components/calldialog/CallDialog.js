import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Tooltip } from 'antd';
import IconClose from './call-icon/close.png';
import IconPhone from './call-icon/phone.png';
import IconArrow from '../../body/message/messageinfor/ticket/icon/play.png';
import './CallDialog.css';
import CallFooter from './call-components/CallFooter';

const CallDialog = ({ members }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState('1234567890');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const settingsRef = useRef(null);
  const [activeButton, setActiveButton] = useState(null);
  const [inputNumber, setInputNumber] = useState('');
  const inputRef = useRef(null);
  const [isLazyActive, setIsLazyActive] = useState(false);
  const [isBranchListVisible, setIsBranchListVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPhoneNumbers = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_CALL_URL);
        const data = await response.json();
        if (data.records && Array.isArray(data.records)) {
          const numbers = data.records.map(record => ({
            number: record.Value,
            label: record.Name
          }));
          setPhoneNumbers(numbers);
          if (numbers.length > 0) {
            setSelectedNumber(numbers[0].number);
          }
        } else {
          console.error('Dữ liệu không đúng định dạng:', data);
        }
      } catch (error) {
        console.error('Lỗi khi lấy số điện thoại:', error);
      }
    };

    fetchPhoneNumbers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsVisible(false);
        setActiveButton(null);
      }
    };

    if (isSettingsVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownVisible]);

  const filteredNumbers = phoneNumbers.filter(phone =>
    phone.number.includes(searchTerm)
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setIsDropdownVisible(false);
  };

  const toggleSettings = () => {
    setIsSettingsVisible(!isSettingsVisible);
    if (isSettingsVisible) {
      setActiveButton(null);
    }
  };

  const handleButtonClick = (buttonName) => {
    if (activeButton === buttonName) {
      setActiveButton(null);
      if (buttonName === 'branch') {
        setIsBranchListVisible(false);
      }
    } else {
      setActiveButton(buttonName);
      if (buttonName === 'branch') {
        setIsBranchListVisible(true);
      }
    }
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions(prevOptions => {
      const newOptions = prevOptions.includes(option)
        ? prevOptions.filter(item => item !== option)
        : [...prevOptions, option];

      if (option === 'LazyCall cuộc gọi đi') {
        setIsLazyActive(newOptions.includes(option));
      }

      return newOptions;
    });
  };

  const handleKeyPress = (key) => {
    // Logic xử lý khi nhấn phím
    console.log(`Key pressed: ${key}`);
  };

  return (
    <>
      <Tooltip title="Gọi điện">
        <Button
          type="primary"
          icon={
            <img
              src={IconPhone}
              alt="phone"
              style={{
                height: '20px',
                width: '20px',
                filter: 'invert(1)',
              }}
            />
          }
          onClick={showModal}
          size="large"
          style={{
            position: 'fixed',
            right: 30,
            bottom: 30,
            height: 55,
            width: 55,
            borderRadius: '10px',
          }}
        />
      </Tooltip>

      {/* Modal */}
      {isModalVisible && (
        <div
          style={{
            position: 'fixed',
            right: 20,
            top: '28%',
            height: '70vh',
            width: '41vh',
            zIndex: 1000,
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Nút đóng */}
          <Button
            type="text"
            icon={
              <img 
                src={IconClose} 
                alt="Close" 
                style={{ 
                  height: '17px', 
                  width: '17px',
                }} 
              />
            }
            onClick={handleCancel}
            style={{
              top: 0,
              left: -47,
              position: 'absolute',
              borderRadius: 12,
              backgroundColor: 'rgb(210 214 220)',
              height: 35,
              width: 35,
              zIndex: 1000,
            }}
          />

          {/* Nội dung của modal */}
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', height: '100%' }}>
            {/* Phần trên cùng */}
            <div 
              className="clickable-div"
              style={{ 
                cursor: 'pointer',
                height: '75px',
                display: 'flex',
                padding: '0 24px',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 177, 255, 0.1)',
                justifyContent: 'space-between',
              }}
              onClick={toggleDropdown}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{selectedNumber}</h3>
                <span style={{ fontSize: '14px', color: '#888' }}>
                  {phoneNumbers.find(phone => phone.number === selectedNumber)?.label || ''}
                </span>
              </div>
              <Button
                className="clickable-button"
                type="text"
                icon={
                  <img 
                    src={IconArrow} 
                    alt="Arrow" 
                    style={{ height: '10px', width: '10px' }} 
                  />
                }
                style={{
                  fontSize: '16px',
                  color: '#000',
                }}
              />
            </div>

            {/* Danh sách số điện thoại */}
            {isDropdownVisible && (
              <div 
                ref={dropdownRef}
                style={{ 
                  position: 'absolute',  
                  right: '103%',
                  boxShadow: '0 2px 8px rgb(0, 0, 0, 0.15)', 
                  borderRadius: 8,
                  width: '80%',
                  zIndex: 2000,
                  backgroundColor: 'white',
                }}
              >
                <div 
                  style={{ 
                    padding: '10px', 
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Input
                    placeholder="Tìm kiếm số điện thoại"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      padding: '8px', 
                      borderBottom: '1px solid rgba(0, 177, 255, 0.1)',
                      border: 'none',
                      borderRadius: '12px',
                      backgroundColor: '#f9f9f9',
                      width: '70%',
                    }}
                  />
                  {filteredNumbers.map((phone) => (
                    <div
                      key={phone.number}
                      onClick={() => handleNumberSelect(phone.number)}
                      className="phone-list-item" // Thêm lớp CSS
                    >
                      {phone.number} - {phone.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Phần giữa */}
            <div 
              style={{ 
                gap: '16px',
                flex: 1,
                display: 'flex',
                padding: '16px 0',
                borderBottom: '1px solid rgba(0, 177, 255, 0.1)',
                flexDirection: 'column', 
              }}
            >
            </div>

            {/* Phần dưới */}
            <CallFooter
              inputNumber={inputNumber}
              setInputNumber={setInputNumber}
              inputRef={inputRef}
              activeButton={activeButton}
              handleButtonClick={handleButtonClick}
              isBranchListVisible={isBranchListVisible}
              members={members}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isLazyActive={isLazyActive}
              setIsLazyActive={setIsLazyActive}
              handleOptionToggle={handleOptionToggle}
              selectedOptions={selectedOptions}
              isSettingsVisible={isSettingsVisible}
              settingsRef={settingsRef}
              toggleSettings={toggleSettings}
              handleKeyPress={handleKeyPress}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CallDialog;