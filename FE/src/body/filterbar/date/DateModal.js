import React, { useState } from 'react';
import { Modal, Row, Col, Button, DatePicker } from 'antd';
import moment from 'moment';
import './DateModal.css';

const DateModal = ({ isVisible, onClose, onDateChange }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDateSelected, setIsDateSelected] = useState(false); // Thêm trạng thái để kiểm tra ngày đã chọn

  const handleButtonClick = (button) => {
    setActiveButton(button);

    let startDate, endDate;

    switch (button) {
      case 'Hôm nay':
        startDate = endDate = moment().startOf('day');
        break;
      case 'Hôm qua':
        startDate = endDate = moment().subtract(1, 'day').startOf('day');
        break;
      case 'Tuần này':
        startDate = moment().startOf('week');
        endDate = moment().endOf('week');
        break;
      case 'Tuần trước':
        startDate = moment().subtract(1, 'week').startOf('week');
        endDate = moment().subtract(1, 'week').endOf('week');
        break;
      case 'Tháng này':
        startDate = moment().startOf('month');
        endDate = moment().endOf('month');
        break;
      case 'Tháng trước':
        startDate = moment().subtract(1, 'month').startOf('month');
        endDate = moment().subtract(1, 'month').endOf('month');
        break;
      default:
        startDate = endDate = null;
    }

    const dates = startDate && endDate ? [startDate, endDate] : [];
    setSelectedDates(dates);
    setIsDateSelected(dates.length > 0); // Cập nhật trạng thái isDateSelected
    onDateChange(dates);
  };

  const handleRangePickerChange = (dates) => {
    if (!dates || dates.length === 0) {
      setActiveButton(null); // Huỷ trạng thái active khi chọn ngày không hợp lệ
    }
    setSelectedDates(dates || []);
    setIsDateSelected(dates && dates.length > 0); // Cập nhật trạng thái isDateSelected
    onDateChange(dates || []);
  };

  const handleInputClick = () => {
    setActiveButton(null); // Chỉ huỷ trạng thái các nút gợi ý, nhưng giữ nguyên ngày đã chọn
    setSelectedDates([]); // Reset lại selectedDates để không có xung đột
    setIsDateSelected(false); // Cập nhật trạng thái isDateSelected
  };

  return (
    <Modal
      title="Ngày tạo"
      visible={isVisible}
      onCancel={onClose}
      footer={null} // Bỏ footer nếu không cần nút OK/Cancel ở dưới
    >
      <Row>
        <Col span={24}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              marginTop: 20,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 10,
                left: 7,
                padding: '0 4px',
                color: 'black',
                zIndex: 1,
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Khoảng thời gian
            </span>
            <DatePicker.RangePicker
              value={selectedDates.length ? selectedDates : []}
              style={{
                width: '100%',
                height: 60,
                paddingTop: 25,
                backgroundColor: '#f5f6fa',
                border: 0,
              }}
              onChange={handleRangePickerChange}
              allowClear // Thêm thuộc tính allowClear
              onClick={handleInputClick} // Hủy trạng thái gợi ý khi click vào input
            />
          </div>
        </Col>
      </Row>
      <Row style={{ marginTop: '10px' }}>
        <span style={{ marginTop: 10 }}>Gợi ý</span>
        <Col span={24} style={{ display: 'flex', flexWrap: 'wrap' }}>
          {['Hôm nay', 'Hôm qua', 'Tuần này', 'Tuần trước', 'Tháng này', 'Tháng trước'].map((btn, index) => (
            <Button
              key={index}
              type="default"
              className={`shadow-button btn-1 ${activeButton === btn ? 'active' : ''}`}
              onClick={() => handleButtonClick(btn)}
              style={{
                margin: '5px',
                backgroundColor: activeButton === btn ? 'black' : '',
                color: activeButton === btn ? 'white' : '',
              }}
            >
              {btn}
            </Button>
          ))}
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col 
          span={24} 
          style={{ 
            display: 'flex', 
            textAlign: 'right' 
          }}
          onClick={handleInputClick}
        >
          <Button
            className="shadow-button btn-2 btn-acp"
            type="primary"
            style={{ marginRight: '8px' }}
            onClick={onClose}
            disabled={!isDateSelected} // Vô hiệu hóa nút "Áp dụng" nếu không có ngày được chọn
          >
            Áp dụng
          </Button>
          <Button 
            className="shadow-button btn-1 btn-2" 
            type="default" onClick={onClose} 
          >
            Đóng
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default DateModal;
