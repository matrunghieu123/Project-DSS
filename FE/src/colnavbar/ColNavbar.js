import React from "react";
import { Layout, Menu, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import LogoFB from './logo-img/Logo-FB.png';
import LogoZL from './logo-img/Logo-Zalo.png';
import LogoTL from './logo-img/Logo-Telegram.png';
import LogoVB from './logo-img/Logo-Viber.png';

const { Sider } = Layout;

const ColNavbar = ({ setTab, handleResetFilter }) => {
  // Hàm thay đổi tab và reset bộ lọc
  const handleTabChange = (newTab) => {
    setTab(newTab);
    handleResetFilter(); // Gọi hàm reset filter mỗi khi tab thay đổi
  };

  return (
    <Sider theme="light" width={70}>
      <Menu
        theme="light"
        mode="vertical"
        style={{ textAlign: "center", marginTop: "20px", padding: 0 }}
      >
        <Menu.Item
          key="0"
          style={menuItemStyle}
        >
          <Tooltip
            title="Chat tổng"
            placement="top"
            overlayInnerStyle={tooltipStyle}
          >
            <div
              onClick={() => handleTabChange("CHATROOM")} // Thay đổi tab và reset filter
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
              onClick={() => handleTabChange("FACEBOOK")} // Thay đổi tab và reset filter
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="3" style={menuItemStyle}>
          <Tooltip title="Zalo" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoZL}
              alt="LogoZL"
              style={iconStyle}
              onClick={() => handleTabChange("ZALO")} // Thay đổi tab và reset filter
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="2" style={menuItemStyle}>
          <Tooltip title="Telegram" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoTL}
              alt="LogoTL"
              style={iconStyle}
              onClick={() => handleTabChange("TELEGRAM")} // Thay đổi tab và reset filter
            />
          </Tooltip>
        </Menu.Item>

        <Menu.Item key="4" style={menuItemStyle}>
          <Tooltip title="Viber" placement="top" overlayInnerStyle={tooltipStyle}>
            <img
              src={LogoVB}
              alt="LogoVB"
              style={iconStyle}
              onClick={() => handleTabChange("VIBER")} // Thay đổi tab và reset filter
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
