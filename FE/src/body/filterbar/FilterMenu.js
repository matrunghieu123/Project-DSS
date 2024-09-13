import React, { useState } from 'react';
import { Dropdown, Menu, Row, Col, Button, Tooltip, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import DateModal from './date/DateModal';
import './FilterMenu.css';

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
  const [dropdownOpen, setDropdownOpen] = useState({
    filter: false,
    tag: false,
    status: false,
    customer: false,
    staff: false,
    date: false,
  });

  const toggleDropdown = (key) => {
    if (key === 'date' && isDateModalVisible) {
      return; // Không mở dropdown nếu modal đang mở
    }
  
    setDropdownOpen((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const showDateModal = () => {
    setIsDateModalVisible(true);
    toggleDropdown('date'); // Đảm bảo dropdown 'date' cũng mở ra khi modal được hiển thị
  };

  const handleDateModalClose = () => {
    setIsDateModalVisible(false);
    setDropdownOpen((prevState) => ({
      ...prevState,
      date: false, // Đảm bảo dropdown 'date' sẽ đóng lại
    }));
  };

  const handleDateChange = (dates) => {
    console.log('Selected Dates:', dates); // Xử lý dữ liệu ngày ở đây
  };

  return (
    <div
      style={{
        backgroundColor: 'rgb(234 235 241)',
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Row style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
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
            >
              Ngày tạo
              <FontAwesomeIcon
                icon={faSortDown}
                className={`custom-icon ${dropdownOpen.date || isDateModalVisible ? 'rotate' : ''}`}
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
              width: 1,
              height: 30,
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
                <FontAwesomeIcon icon={faSquarePlus} style={{ fontSize: 18, marginTop: 1, }} />
              </Button>
            </Dropdown>
          </Col>
        </div>
      </Row>

      <DateModal isVisible={isDateModalVisible} onClose={handleDateModalClose} onDateChange={handleDateChange} />
    </div>
  );
};

export default FilterBar;
