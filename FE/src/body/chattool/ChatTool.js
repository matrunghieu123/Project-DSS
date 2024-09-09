import React from "react";
import { Card, Switch, Input, Button, Avatar, Form, Collapse, Tooltip } from "antd";
import { PhoneOutlined, MailOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './ChatTool.css';

const { Panel } = Collapse;

const ChatTool = () => {
  return (
    <div style={{ padding: 16, maxWidth: 300, maxHeight: 577, margin: "0 auto", overflowY: 'auto' }}>
      <Card style={{ marginBottom: 16 }}>
        <Form layout="vertical">
          <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
              <Switch defaultChecked style={{ flex: '0' }} />
              <span style={{ padding: '10px' }}>Trạng thái ChatBot</span>
            </div>
            {/* Icon dấu hỏi chấm với Tooltip */}
            <Tooltip title="Trạng thái hiện tại của ChatBot">
              <QuestionCircleOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
            </Tooltip>
          </div>
        </Form>
      </Card>

      {/* Container với max-height và overflow-y để có thanh cuộn */}
      <div 
        style={{ 
            maxHeight: 'calc(90vh - 100px)', 
            backgroundColor: 'white'
            }}
        >
        {/* Đặt accordion cho Collapse để khi mở một panel, các panel khác sẽ đóng lại */}
        <Collapse accordion style={{ marginBottom: 16 }}>
          <Panel header="Tag" key="1">
            <Form layout="vertical">
              <Form.Item label="Tag">
                <Input placeholder="Thêm tag..." />
              </Form.Item>
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
            <Card>
              <div style={{ textAlign: "center" }}>
                <Avatar size={64}>HT</Avatar>
                <p style={{ marginTop: 8 }}>Hiếu Trung</p>
              </div>
              <Form.Item label="Giới tính">
                <Input placeholder="-" disabled />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input prefix={<PhoneOutlined />} placeholder="Chưa có dữ liệu" disabled />
              </Form.Item>
              <Form.Item label="Email">
                <Input prefix={<MailOutlined />} placeholder="-" disabled />
              </Form.Item>
              <Button type="primary" block>
                Chỉnh sửa
              </Button>
            </Card>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default ChatTool;
