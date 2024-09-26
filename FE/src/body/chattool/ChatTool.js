import React, { useState, useRef } from "react";
import { Card, Switch, Input, Button, Avatar, Form, Collapse, Tooltip, Tag } from "antd";
import { PhoneOutlined, MailOutlined, QuestionCircleOutlined, CalendarOutlined, HomeOutlined, PlusOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './ChatTool.css';

const { Panel } = Collapse;

const ChatTool = ({ avatar, username }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const [tags, setTags] = useState(["tuvan", "hotro", "phananhdichvu"]); // Dữ liệu tag mẫu
  const [inputValue, setInputValue] = useState(""); 
  const [notes, setNotes] = useState([]); // Trạng thái để quản lý các ghi chú
  const [noteInput, setNoteInput] = useState(""); // Trạng thái để quản lý giá trị nhập vào của ghi chú

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

  const handleNoteInputChange = (e) => {
    setNoteInput(e.target.value);
  };

  const handleAddNote = () => {
    if (noteInput.trim() !== "") {
      const newNote = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        content: noteInput.trim(),
      };
      setNotes(prevNotes => [...prevNotes, newNote]);
      setNoteInput("");
    }
  };

  const handleDeleteNote = (index) => {
    setNotes(prevNotes => prevNotes.filter((_, i) => i !== index));
  };

  return (
    <div className="chat-tool-container">
      <div className="tool-wrapper">
        <Card className="status-card">
          <Form layout="vertical">
            <div className="status-container">
              <Switch defaultChecked />
              <span className="infor-text-header">Trạng thái ChatBot</span>
              <Tooltip title="Trạng thái hiện tại của ChatBot" getPopupContainer={trigger => trigger.parentElement}>
                <QuestionCircleOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
              </Tooltip>
            </div>
          </Form>
        </Card>

        <Collapse bordered={false} accordion className="collapse-container">
          <Panel className="infor-text-header" header="Tag" key="1">
            <Form layout="vertical">
              <Input
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
              <div className="tag-container">
                {tags.map((tag, index) => (
                  <Tag key={index} closable>
                    #{tag}
                  </Tag>
                ))}
              </div>
              <div className="action-buttons">
                <Button type="primary">Lưu lại</Button>
                <Button>Hủy</Button>
              </div>
            </Form>
          </Panel>

          <Panel className="infor-text-header" header="Ghi chú & Tương tác" key="2">
            <div className="notes-container">
              {notes.map((note, index) => (
                <div key={index} className="note-item">
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => handleDeleteNote(index)}
                    className="note-delete-button"
                  />
                  <div className="note-header">
                    <div className="note-date">{note.date}</div>
                  </div>
                  <div className="note-time">{note.time}</div>
                  <div className="note-content">{note.content}</div>
                </div>
              ))}
            </div>
            <Form layout="vertical">
              <Input.TextArea
                placeholder="Nhập ghi chú..."
                value={noteInput}
                onChange={handleNoteInputChange}
                onPressEnter={handleAddNote}
              />
              <Button type="primary" onClick={handleAddNote} disabled={!noteInput.trim()}>
                Thêm ghi chú
              </Button>
            </Form>
          </Panel>

          <Panel className="infor-text-header" header="Thông tin cuộc trò chuyện" key="3">
            <div className="info-container">
              <Card bordered={false}>
                <div className="avatar-container">
                  <Avatar size={64}>{avatar}</Avatar>
                  <p className="infor-text">{username}</p>
                </div>

                <Form form={form} layout="vertical">
                  <Form.Item className="infor-text" label="Giới tính">
                    <Input placeholder="- - -" disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item className="infor-text" label="Số điện thoại">
                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item className="infor-text" label="Email">
                    <Input prefix={<MailOutlined />} placeholder="Nhập email" disabled={!isEditing} />
                  </Form.Item>
                  <Form.Item className="infor-text" label="Ngày sinh">
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
    </div>
  );
};

export default ChatTool;
