import React from 'react';
import { Dropdown, Menu, Row, Col, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import './FilterMenu.css'

// Tạo các menu khác nhau cho từng mục
const FilterMenu = () => (
  <Menu>
    <Menu.Item key="1">Tất cả bộ lọc</Menu.Item>
    <Menu.Item key="2">Bộ lọc mặc định</Menu.Item>
  </Menu>
);

const TagMenu = () => (
  <Menu>
    <Menu.Item key="1">Tag 1</Menu.Item>
    <Menu.Item key="2">Tag 2</Menu.Item>
  </Menu>
);

const StatusMenu = () => (
  <Menu>
    <Menu.Item key="1">Đã đọc</Menu.Item>
    <Menu.Item key="2">Chưa đọc</Menu.Item>
  </Menu>
);

const CustomerMenu = () => (
  <Menu>
    <Menu.Item key="1">Khách hàng VIP</Menu.Item>
    <Menu.Item key="2">Khách hàng mới</Menu.Item>
  </Menu>
);

const StaffMenu = () => (
  <Menu>
    <Menu.Item key="1">Nhân viên A</Menu.Item>
    <Menu.Item key="2">Nhân viên B</Menu.Item>
  </Menu>
);

const DateMenu = () => (
  <Menu>
    <Menu.Item key="1">Ngày hôm nay</Menu.Item>
    <Menu.Item key="2">Tuần này</Menu.Item>
  </Menu>
);

const MoreAttributesMenu = () => (
  <Menu>
    <Menu.Item key="1">Thuộc tính A</Menu.Item>
    <Menu.Item key="2">Thuộc tính B</Menu.Item>
  </Menu>
);

const FilterBar = () => {
  return (
    <div
      style={{
        backgroundColor: 'rgb(220 223 227)',
        padding: '10px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Row style={{ width: '100%' }}>
        <div 
          className="custom-button-padding"
          style={{
            display: 'flex',
            flex: '1',
            padding: '0'
          }}
        >
          <Col>
            <Dropdown overlay={FilterMenu} trigger={['click']}>
              <Button 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '7px'
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
                <FontAwesomeIcon icon={faSortDown} className="custom-icon"/>
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown overlay={TagMenu} trigger={['click']}>
              <Button type="text">
                Tag
                <FontAwesomeIcon icon={faSortDown} className="custom-icon"/>
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown overlay={StatusMenu} trigger={['click']}>
              <Button type="text">
                Trạng thái đã đọc
                <FontAwesomeIcon icon={faSortDown} className="custom-icon"/>
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown overlay={CustomerMenu} trigger={['click']}>
              <Button type="text">
                Khách hàng
                <FontAwesomeIcon icon={faSortDown} className="custom-icon"/>
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown overlay={StaffMenu} trigger={['click']}>
              <Button type="text">
                Nhân viên tiếp nhận
                <FontAwesomeIcon icon={faSortDown} className="custom-icon"/>
              </Button>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown overlay={DateMenu} trigger={['click']}>
              <Button type="text">
                Ngày tạo
                <FontAwesomeIcon icon={faSortDown} className="custom-icon"/>
              </Button>
            </Dropdown>
          </Col>
        </div>
        
        <div
          className="custom-button-padding"
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Col style={{ marginLeft: 'auto' }}>
            <Dropdown overlay={FilterMenu} trigger={['click']}>
              <Button 
                icon={<FontAwesomeIcon icon={faFilterCircleXmark} color='rgba(0, 0, 0, 0.45)'/>} 
                type="text" 
              />
            </Dropdown>
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
                  alignItems: 'center'
                }}
                type="text"
              >
                Thuộc tính khác 
                <FontAwesomeIcon 
                  icon={faSquarePlus} 
                  style={{ 
                    fontSize: 'medium'
                  }} 
                />
              </Button>
            </Dropdown>
          </Col>
        </div>
      </Row>
    </div>
  );
};

export default FilterBar;
