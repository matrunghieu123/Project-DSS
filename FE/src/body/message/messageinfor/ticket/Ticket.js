import React from 'react';
import { Button, Drawer, Input, Steps, Table, Typography, Tag } from 'antd';
import { EyeOutlined, EditOutlined, SearchOutlined, FilterOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { FaPaperclip } from 'react-icons/fa';
import './Ticket.css';

const { TextArea } = Input;
const { Step } = Steps;
const { Title, Text } = Typography;

const columns = [
    {
        title: (
            <span className="column-title">
                User tạo/Update <SearchOutlined className="small-icon" />
            </span>
        ),
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: (
            <span className="column-title">
                Trạng thái trước <FilterOutlined className="small-icon" />
            </span>
        ),
        dataIndex: 'statusBefore',
        key: 'statusBefore',
    },
    {
        title: (
            <span className="column-title">
                Trạng thái sau <FilterOutlined className="small-icon" />
            </span>
        ),
        dataIndex: 'statusAfter',
        key: 'statusAfter',
    },
    {
        title: (
            <span className="column-title">
                Ngày cập nhật
                <span className="column-icons">
                    <CaretUpOutlined className="small-icon"/>
                    <CaretDownOutlined className="small-icon" style={{ marginTop: '-5px' }} />
                </span>
            </span>
        ),
        dataIndex: 'updateDate',
        key: 'updateDate',
    },
    {
        title: (
            <span className="column-title">
                Nội dung <SearchOutlined className="small-icon" />
            </span>
        ),
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: (
            <span className="column-title">
                File <SearchOutlined className="small-icon" />
            </span>
        ),
        dataIndex: 'file',
        key: 'file',
        render: (text) => <a href={text}>{text}</a>,
    },
];

const data = [
    {
        key: '1',
        user: 'User ...',
        statusBefore: 'Đang xử lý',
        statusAfter: 'Online',
        updateDate: '20-12-2024',
        content: 'text tối đa 2 dòng',
        file: 'xxx.png',
    },
    // Thêm các hàng khác nếu cần
];

const Ticket = ({ visible, onClose }) => {
    return (
        <Drawer
            placement="right"
            onClose={onClose}
            visible={visible}
            width={'80%'}
        >
            <div className="ticket-content">
                <div className="ticket-header">
                    <Button type="text">Chi tiết <EyeOutlined /></Button>
                    <Button type="text">Xử lý <EditOutlined /></Button>
                </div>
                <div className="ticket-info">
                    <Title level={4} className="ticket-title">Ticket xxxxx</Title>
                    <hr className="divider" />
                    <div className="ticket-details">
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Ngày tạo:</Text>
                            <Text className="ticket-detail-value">12-12-2024</Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Khách hàng:</Text>
                            <Text className="ticket-detail-value">Công ty X</Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Người tạo:</Text>
                            <Text className="ticket-detail-value">Nguyễn Huy Tuấn</Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Người xử lý:</Text>
                            <Text className="ticket-detail-value">Kiều Ngọc Khánh</Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Chủ đề ticket:</Text>
                            <Text className="ticket-detail-value"><Tag>Chủ đề 1</Tag> <Tag>Chủ đề 2</Tag></Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Trạng thái:</Text>
                        </div>
                        <Steps current={1} className="ticket-steps">
                            <Step title="Tạo mới" />
                            <Step title="Đang xử lý" />
                            <Step title="Update" />
                            <Step title="Waiting" />
                            <Step title="Hoàn thành" />
                        </Steps>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Thời hạn xử lý:</Text>
                            <Text className="ticket-detail-value">Trong hạn xử lý (còn 3 ngày)</Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Nhân viên liên quan:</Text>
                            <Text className="ticket-detail-value"><Tag>Nhân viên 1</Tag> <Tag>Nhân viên 2</Tag></Text>
                        </div>
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">Nội dung xử lý:</Text>
                        </div>
                        <TextArea placeholder="Ghi chú abc" />
                        <div className="ticket-detail-item">
                            <Text className="ticket-detail-label">File đính kèm:</Text>
                            <Text className="ticket-detail-value">
                                <a href="xxx.png">
                                    <FaPaperclip style={{ fontSize: '12px', color: 'gray' }} /> xxx.png
                                </a>
                                <a href="xxx.png">
                                    <FaPaperclip style={{ fontSize: '12px', color: 'gray' }} /> xxx.png
                                </a>
                                <a href="xxx.png">
                                    <FaPaperclip style={{ fontSize: '12px', color: 'gray' }} /> xxx.png
                                </a>
                            </Text>
                        </div>
                    </div>
                </div>
                <div 
                    className="ticket-history" 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                    }}
                >
                    <Title level={4} className="ticket-title">Lịch sử tác động</Title>
                    <hr className="divider" />
                    <Table 
                        columns={columns} 
                        dataSource={data} 
                        pagination={{ pageSize: 10 }} 
                        style={{ width: '100%' }} 
                        className="custom-table"
                    />
                </div>
                <div className="ticket-footer">
                    <Button type="primary">Lưu lại</Button>
                    <Button onClick={onClose} style={{ marginLeft: '10px' }}>Đóng</Button>
                </div>
            </div>
        </Drawer>
    );
};

export default Ticket;
