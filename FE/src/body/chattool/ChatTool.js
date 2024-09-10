import React, { useState, useRef } from "react";
import { Card, Switch, Input, Button, Avatar, Form, Collapse, Tooltip, Tag } from "antd";
import { PhoneOutlined, MailOutlined, QuestionCircleOutlined, CalendarOutlined, HomeOutlined, SendOutlined } from '@ant-design/icons';
import './ChatTool.css';

const { Panel } = Collapse;

const ChatTool = ({ avatar, username }) => { // Nhận props avatar và username
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const [tags, setTags] = useState([]); // Danh sách các tag
  const [inputValue, setInputValue] = useState(""); // Giá trị nhập liệu

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const inputRef = useRef(null);

  // thêm tag
  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags(prevTags => [...prevTags, `#${inputValue.trim()}`]);
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.focus(); // Đặt lại focus vào thanh tìm kiếm sau khi thêm tag
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div style={{ padding: "16px 10px 0 16px" }}>
      <Card style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
              <Switch defaultChecked style={{ flex: '0' }} />
              <span style={{ padding: '10px' }}>Trạng thái ChatBot</span>
            </div>
            <Tooltip 
              title="Trạng thái hiện tại của ChatBot" 
              getPopupContainer={trigger => trigger.parentElement} 
            >
              <QuestionCircleOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
            </Tooltip>
          </div>
        </Form>
      </Card>

      <Collapse 
        bordered={false} 
        accordion 
        style={{ background: 'white' }}
      >
        <Panel header="Tag" key="1">
          <Form layout="vertical">
            <Form.Item label="Tag">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Thêm tag..."
                suffix={
                  <Button
                    type="text"
                    icon={<SendOutlined />}
                    onClick={handleAddTag}
                    disabled={!inputValue.trim()}
                  />
                }
              />
            </Form.Item>
            <div>
              {tags.map((tag, index) => (
                <Tag key={index} closable>
                  {tag}
                </Tag>
              ))}
            </div>
          </Form>
        </Panel>

        <Panel header="Ghi chú & Tương tác" key="2">
          <Form layout="vertical">
            <Form.Item label="Ghi chú & Tương tác">
              <Input.TextArea placeholder="Ghi chú..." />
            </Form.Item>
          </Form>
        </Panel>

        <Panel header="Thông tin cuộc trò chuyện" key="3">
          <div style={{ maxHeight: 338, overflowX: 'hidden', overflowY: 'auto' }}>
            <Card bordered={false}>
              <div style={{ textAlign: "center" }}>
                {/* Hiển thị avatar và tên người dùng nhận từ props */}
                <Avatar size={64}>{avatar}</Avatar>
                <p style={{ marginTop: 8 }}>{username}</p>
              </div>

              <Form form={form} layout="vertical">
                <Form.Item label="Giới tính">
                  <Input placeholder="- - -" disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Email">
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Ngày sinh">
                  <Input prefix={<CalendarOutlined />} placeholder="Nhập ngày sinh" disabled={!isEditing} />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ" disabled={!isEditing} />
                </Form.Item>
                <Button type="primary" block onClick={handleEdit}>
                  {isEditing ? 'Lưu' : 'Chỉnh sửa'}
                </Button>
              </Form>
            </Card>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ChatTool;
