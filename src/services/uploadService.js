import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async event => {
  let toastId = null;

  const images = await getImage(event);
  if (!images) return null;

  const imageUrls = [];
  for (const image of images) {
    const formData = new FormData();
    formData.append('image', image, image.name);
  const response = await axios.post('api/upload', formData, {
    onUploadProgress: ({ progress }) => {
      if (toastId) toast.update(toastId, { progress });
      else toastId = toast.success('Uploading...', { progress });
    },
  });
  toast.dismiss(toastId);
    imageUrls.push(response.data.imageUrl);
  }
  return imageUrls;
};

const getImage = async event => {
  const files = event.target.files;

  if (!files || files.length <= 0) {
    toast.warning('Upload file is nott selected!', 'File Upload');
    return null;
  }

  const validFiles = Array.from(files).filter(file => file.type === 'image/jpeg');

  if (validFiles.length === 0) {
    toast.error('No valid JPG files selected', 'File Type Error');
    return null;
  }

  return validFiles;
};
