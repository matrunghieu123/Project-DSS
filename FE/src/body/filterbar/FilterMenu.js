import React, { useState } from 'react';
import { Dropdown, Menu, Row, Col, Button, Tooltip, Input, Modal, DatePicker } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import './FilterMenu.css';

// Menu với trường tìm kiếm
const FilterMenu = () => (
  <Menu>
    <Menu.Item key="search">
      <Input.Search placeholder="Tìm kiếm" />
    </Menu.Item>
    <Menu.Item key="1">Tất cả bộ lọc</Menu.Item>
    <Menu.Item key="2">Bộ lọc mặc định</Menu.Item>
  </Menu>
);
const TagMenu = () => (
  <Menu>
    <Menu.Item key="search">
      <Input.Search placeholder="Tìm kiếm" />
    </Menu.Item>
    <Menu.Item key="1">Tag 1</Menu.Item>
    <Menu.Item key="2">Tag 2</Menu.Item>
  </Menu>
);

const StatusMenu = () => (
  <Menu>
    <Menu.Item key="search">
      <Input.Search placeholder="Tìm kiếm" />
    </Menu.Item>
    <Menu.Item key="1">Đã đọc</Menu.Item>
    <Menu.Item key="2">Chưa đọc</Menu.Item>
  </Menu>
);

const CustomerMenu = () => (
  <Menu>
    <Menu.Item key="search">
      <Input.Search placeholder="Tìm kiếm" />
    </Menu.Item>
    <Menu.Item key="1">Khách hàng VIP</Menu.Item>
    <Menu.Item key="2">Khách hàng mới</Menu.Item>
  </Menu>
);

const StaffMenu = () => (
  <Menu>
    <Menu.Item key="search">
      <Input.Search placeholder="Tìm kiếm" />
    </Menu.Item>
    <Menu.Item key="1">Nhân viên A</Menu.Item>
    <Menu.Item key="2">Nhân viên B</Menu.Item>
  </Menu>
);

const DateModal = ({ isVisible, onClose }) => (
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
          }}>
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 7, 
              padding: '0 4px',
              color: 'black',
              zIndex: 1,   // Đảm bảo chữ nằm trên DatePicker
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            Khoảng thời gian
          </span>
          <DatePicker.RangePicker
            style={{
              width: '100%',
              height: 60,
              paddingTop: 25,  // Tạo khoảng cách giữa chữ và nội dung bên trong DatePicker,
              backgroundColor: '#f5f6fa',
              border: 0,
            }}
          />
        </div>
      </Col>
    </Row>
    <Row style={{ marginTop: '10px' }}>
      <span 
        style={{
          marginTop: 10,
        }}
      >
        Gợi ý
      </span>
      <Col span={24} style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Button 
          type="default" 
          className="shadow-button btn-1"
        >
          Hôm nay
        </Button>
        <Button 
          type="default" 
          className="shadow-button btn-1"
        >
          Hôm qua
        </Button>
        <Button 
          type="default" 
          className="shadow-button btn-1"
        >
          Tuần này
        </Button>
        <Button 
          type="default" 
          className="shadow-button btn-1"
        >
          Tuần trước
        </Button>
        <Button 
          type="default" 
          className="shadow-button btn-1"
        >
          Tháng này
        </Button>
        <Button 
          type="default" 
          className="shadow-button btn-1"
        >
          Tháng trước
        </Button>
      </Col>
    </Row>
    <Row style={{ marginTop: '20px' }}>
      <Col 
        span={24} 
        style={{ 
          display: 'flex', 
          textAlign: 'right',
        }}
      >
        <Button
          className="shadow-button btn-2"
          type="primary"
          style={{ marginRight: '8px' }}
        >
          Áp dụng
        </Button>
        <Button className="shadow-button btn-1 btn-2" type="default" onClick={onClose}>
          Đóng
        </Button>
      </Col>
    </Row>
  </Modal>
);


const MoreAttributesMenu = () => (
  <Menu>
    <Menu.Item key="search">
      <Input.Search placeholder="Tìm kiếm" />
    </Menu.Item>
    <Menu.Item key="1">Thuộc tính A</Menu.Item>
    <Menu.Item key="2">Thuộc tính B</Menu.Item>
  </Menu>
);


const FilterBar = ({ onClearFilter }) => {
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);

  //hàm kiểm tra dropdown
  const [dropdownOpen, setDropdownOpen] = useState({
    filter: false,
    tag: false,
    status: false,
    customer: false,
    staff: false,
    date: false,
  });

  const toggleDropdown = (key) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };  

  // hiện ngày
  const showDateModal = () => {
    setIsDateModalVisible(true);
  };

  // đóng cửa sổ ngày
  const handleDateModalClose = () => {
    setIsDateModalVisible(false);
  };
  
  return (
    <div
      style={{
        backgroundColor: 'rgb(220 223 227)',
        padding: '10px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Row style={{ width: '100%', display: 'flex', flexWrap: 'wrap', }}>
        <div
          className="left-side custom-button-padding"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flex: '1',
            padding: '0',
          }}
        >
          <Col>
            <Tooltip title="Bộ lọc của tôi">
              <Dropdown
                overlay={FilterMenu}
                trigger={['click']}
                onVisibleChange={() => toggleDropdown('filter')}
              >
                <Button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '7px',
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} />
                  <FontAwesomeIcon
                    icon={faSortDown}
                    className={`custom-icon ${dropdownOpen.filter ? 'rotate' : ''}`}
                  />
                </Button>
              </Dropdown>
            </Tooltip>
          </Col>
          <Col>
            <Dropdown
                overlay={TagMenu}
                trigger={['click']}
                onVisibleChange={() => toggleDropdown('tag')}
              >
              <Button type="text">
                Tag
                <FontAwesomeIcon
                  icon={faSortDown}
                  className={`custom-icon ${dropdownOpen.tag ? 'rotate' : ''}`}
                />
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown
                overlay={StatusMenu}
                trigger={['click']}
                onVisibleChange={() => toggleDropdown('status')}
              >
              <Button type="text">
                Trạng thái đã đọc
                <FontAwesomeIcon
                  icon={faSortDown}
                  className={`custom-icon ${dropdownOpen.status ? 'rotate' : ''}`}
                />
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown
                overlay={CustomerMenu}
                trigger={['click']}
                onVisibleChange={() => toggleDropdown('customer')}
              >
              <Button type="text">
                Khách hàng
                <FontAwesomeIcon
                  icon={faSortDown}
                  className={`custom-icon ${dropdownOpen.customer ? 'rotate' : ''}`}
                />
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown
                overlay={StaffMenu}
                trigger={['click']}
                onVisibleChange={() => toggleDropdown('staff')}
              >
              <Button type="text">
                Nhân viên tiếp nhận
                <FontAwesomeIcon
                  icon={faSortDown}
                  className={`custom-icon ${dropdownOpen.staff ? 'rotate' : ''}`}
                />
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Button 
              type="text" 
              onClick={showDateModal} 
              onVisibleChange={() => toggleDropdown('date')} 
            >
              Ngày tạo
              <FontAwesomeIcon
                icon={faSortDown}
                className={`custom-icon ${dropdownOpen.date ? 'rotate' : ''}`}
              />
            </Button>
          </Col>
        </div>

        <div
          className="right-side custom-button-padding"
          style={{
            display: 'flex',
            marginLeft: 'auto',
            flex: 'none',
          }}
        >
          <Col style={{ marginLeft: 'auto' }}>
            <Tooltip title="Xoá giá trị bộ lọc hiện tại">
              <Button
                icon={<FontAwesomeIcon icon={faFilterCircleXmark} color="rgba(0, 0, 0, 0.45)" />}
                type="text"
                onClick={onClearFilter} // Gọi hàm khi ấn vào icon
              />
            </Tooltip>
          </Col>

          {/* Đường gạch thẳng */}
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#ccc',
            }}
          />

          <Col>
            <Dropdown overlay={MoreAttributesMenu} trigger={['click']}>
              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                type="text"
              >
                Thuộc tính khác
                <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: 'medium' }} />
              </Button>
            </Dropdown>
          </Col>
        </div>
      </Row>

      <DateModal isVisible={isDateModalVisible} onClose={handleDateModalClose} />
    </div>
  );
};

export default FilterBar;
