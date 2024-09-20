import React from 'react';
import { FaFileWord, FaFileExcel, FaFilePdf, FaFileAlt } from 'react-icons/fa';

const getFileIcon = (fileType) => {
    switch (fileType) {
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return <FaFileWord className="file-icon" />;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return <FaFileExcel className="file-icon" />;
        case 'application/pdf':
            return <FaFilePdf className="file-icon" />;
        default:
            return <FaFileAlt className="file-icon" />;
    }
};

const FileMessage = ({ fileUrl, fileType }) => {
    return (
        <div style={styles.fileMessage}>
            {getFileIcon(fileType)}
            <div style={styles.fileInfo}>
                <a href={fileUrl} download style={styles.fileName}>
                    Tải xuống file
                </a>
            </div>
        </div>
    );
};

const styles = {
    fileMessage: {
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '8px',
        margin: '4px 0',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    fileIcon: {
        fontSize: '24px',
        marginRight: '8px',
        color: '#007bff',
    },
    fileInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    fileName: {
        fontWeight: 'bold',
        color: '#007bff',
        textDecoration: 'none',
    },
    fileNameHover: {
        textDecoration: 'underline',
    },
    fileSize: {
        fontSize: '12px',
        color: '#666',
    },
};

export default FileMessage;
