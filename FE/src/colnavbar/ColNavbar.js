import React from "react";
import { Layout, Menu, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import LogoFB from './logo-img/Logo-FB.png';
import LogoZL from './logo-img/Logo-Zalo.png';
import LogoTL from './logo-img/Logo-Telegram.png';
import LogoVB from './logo-img/Logo-Viber.png';

const { Sider } = Layout;

const ColNavbar = ({ setTab, handleResetFilter, setLoginType, setSource, setMembers, baseUrl }) => { // Nhận baseUrl
  const handleTabChange = async (newTab, source) => {
    setTab(newTab);
    handleResetFilter();
    setLoginType(newTab);
    setSource(source);

    // Gọi API để lấy danh sách thành viên
    try {
      const response = await fetch(`${baseUrl}/chatroom/${source}`);
      const data = await response.json();
      setMembers(data.members); // Giả sử API trả về danh sách thành viên trong thuộc tính 'members'
    } catch (error) {
      console.error("Lỗi khi tải danh sách thành viên:", error);
    }
  };

  return (
    <Sider theme="light" width={70} style={{ backgroundColor: 'rgb(245, 246, 250)' }}>
      <Menu
        theme="light"
        mode="vertical"
        style={{ textAlign: "center", marginTop: "20px", padding: 0, backgroundColor: '#f5f6fa', border: 'none' }}
      >
        <Menu.Item
          key="0"
          style={menuItemStyle}
        >
          <Tooltip
            title="Chat chung"
            placement="top"
            overlayInnerStyle={tooltipStyle}
          >
            <div
              onClick={() => handleTabChange("CHATROOM", null)}
              style={iconContainerStyle}
            >
              <MessageOutlined style={{ fontSize: "20px" }} />
            </div>
          </Tooltip>
        </Menu.Item>

        {/* Facebook, Zalo, Telegram, Viber */}
        <Menu.Item key="5" style={menuItemStyle}>
          <Tooltip title="Facebook" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoFB}
              alt="LogoFB"
              style={iconStyle}
              onClick={() => handleTabChange("FACEBOOK", "facebook")} // Truyền thông tin nguồn
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="3" style={menuItemStyle}>
          <Tooltip title="Zalo" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoZL}
              alt="LogoZL"
              style={iconStyle}
              onClick={() => handleTabChange("ZALO", "zalo")} // Truyền thông tin nguồn
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="2" style={menuItemStyle}>
          <Tooltip title="Telegram" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoTL}
              alt="LogoTL"
              style={iconStyle}
              onClick={() => handleTabChange("TELEGRAM", "telegram")} // Truyền thông tin nguồn
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="4" style={menuItemStyle}>
          <Tooltip title="Viber" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoVB}
              alt="LogoVB"
              style={iconStyle}
              onClick={() => handleTabChange("VIBER", "viber")} // Truyền thông tin nguồn
            />
          </Tooltip>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

// Style cho các Menu.Item và Tooltip
const menuItemStyle = {
  height: "60px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  margin: "0 5px",
};

const tooltipStyle = {
  backgroundColor: "#fff",
  color: "#000",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  borderRadius: "4px",
};

const iconStyle = {
  width: "20px",
  height: "auto",
  cursor: "pointer",
};

const iconContainerStyle = {
  fontSize: "20px",
  color: "#1890ff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
};

export default ColNavbar;
