  import React from 'react';
  import './InfoPanel.css';

  const InfoItem = ({ icon, label, text, onClick }) => {
    return (
      <button className="info-item" onClick={onClick}>
        <div className={`info-icon ${text ? 'has-border' : ''} ${icon ? 'icon-only' : ''}`}>
          {icon ? (
            <img src={icon} alt={label} />
          ) : (
            <span className={text === '0' ? 'info-icon-number' : ''}>{text}</span>
          )}
        </div>
        <div className="info-label">{label}</div>
      </button>
    );
  };

  const InfoPanel = () => {
    const handleItemClick = (label) => {
      alert(`Clicked on ${label}`);
    };

    return (
      <div className="info-container">
        <InfoItem text="0" label="CCU" onClick={() => handleItemClick('CCU')} />
        <InfoItem icon="https://img.icons8.com/?size=100&id=24945&format=png&color=ffffff" label="Doanh nghiệp" onClick={() => handleItemClick('Doanh nghiệp')} />
        <InfoItem icon='https://img.icons8.com/?size=100&id=i2llp4qsMKom&format=png&color=000000' label="Ngôn ngữ" onClick={() => handleItemClick('Ngôn ngữ')} />
      </div>
    );
  };

  export default InfoPanel;
