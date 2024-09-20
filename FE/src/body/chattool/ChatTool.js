import React, { useState, useRef } from "react";
import { Card, Switch, Input, Button, Avatar, Form, Collapse, Tooltip, Tag } from "antd";
import { PhoneOutlined, MailOutlined, QuestionCircleOutlined, CalendarOutlined, HomeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './ChatTool.css';

const { Panel } = Collapse;

const ChatTool = ({ avatar, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const [tags, setTags] = useState(["tuvan", "hotro", "phananhdichvu"]); // Dữ liệu tag mẫu
  const [inputValue, setInputValue] = useState(""); 

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const inputRef = useRef(null);

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      setTags(prevTags => [...prevTags, `#${inputValue.trim()}`]);
      setInputValue("");
      if (inputRef.current) {
        inputRef.current.focus();
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
    <div className="chat-tool-container">
      <div style={{ padding: "16px 10px 0 16px" }}>
        <Card style={{ marginBottom: 16 }}>
          <Form layout="vertical">
            <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                <Switch defaultChecked style={{ flex: '0' }} />
                <span className="infor-text" style={{ padding: '10px' }}>Trạng thái ChatBot</span>
              </div>
              <Tooltip title="Trạng thái hiện tại của ChatBot" getPopupContainer={trigger => trigger.parentElement}>
                <QuestionCircleOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
              </Tooltip>
            </div>
          </Form>
        </Card>

        <Collapse bordered={false} accordion style={{ background: 'white' }}>
          <Panel className="infor-text" header="Tag" key="1">
            <Form layout="vertical">
              <Input
                style={{
                  border: 0,
                }}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm | Thêm Tag"
                suffix={
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={handleAddTag}
                    disabled={!inputValue.trim()}
                  />
                }
                prefix={<SearchOutlined />}
              />
              <div style={{ marginTop: 8 }}>
                {tags.map((tag, index) => (
                  <Tag key={index} closable>
                    #{tag}
                  </Tag>
                ))}
              </div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary">Lưu lại</Button>
                <Button>Hủy</Button>
              </div>
            </Form>
          </Panel>

          <Panel className="infor-text" header="Ghi chú & Tương tác" key="2">
            <Form layout="vertical">
              <Input.TextArea 
                placeholder="Ghi chú..." 
                style={{
                  border: 0,
                }}
              />
            </Form>
          </Panel>

          <Panel className="infor-text" header="Thông tin cuộc trò chuyện" key="3">
            <div 
              style={{ 
                maxHeight: 338, 
                overflowX: 'hidden', 
                overflowY: 'auto' 
              }}
            >
              <Card bordered={false}>
                <div style={{ textAlign: "center" }}>
                  <Avatar size={64}>{avatar}</Avatar>
                  <p className="infor-text" style={{ marginTop: 8 }}>{username}</p>
                </div>

                <Form form={form} layout="vertical">
                  <Form.Item className="infor-text" label="Giới tính">
                    <Input 
                      placeholder="- - -" 
                      disabled={!isEditing} 
                    />
                  </Form.Item>
                  <Form.Item className="infor-text" label="Số điện thoại">
                    <Input 
                      prefix={<PhoneOutlined />} 
                      placeholder="Nhập số điện thoại" 
                      disabled={!isEditing} 
                    />
                  </Form.Item>
                  <Form.Item className="infor-text" label="Email">
                    <Input 
                      prefix={<MailOutlined />} 
                      placeholder="Nhập email" 
                      disabled={!isEditing} 
                    />
                  </Form.Item>
                  <Form.Item className="infor-text" label="Ngày sinh">
                    <Input 
                      prefix={<CalendarOutlined />} 
                      placeholder="Nhập ngày sinh" 
                      disabled={!isEditing} 
                    />
                  </Form.Item>
                  <Form.Item label="Địa chỉ">
                    <Input 
                      prefix={<HomeOutlined />} 
                      placeholder="Nhập địa chỉ" 
                      disabled={!isEditing} 
                    />
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
    </div>
  );
};

export default ChatTool;
