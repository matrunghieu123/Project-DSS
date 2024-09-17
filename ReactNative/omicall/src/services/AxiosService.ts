import axios from 'axios';

export const getFileSize = async (fileUrl: string): Promise<number> => {
  try {
    const response = await axios.head(fileUrl);
    const contentLength = response.headers['content-length'];
    return parseInt(contentLength, 10);
  } catch (error) {
    console.error('Error fetching file size:', error);
    return 0;
  }
};
