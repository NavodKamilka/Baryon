import axios from 'axios';

const uploadImageToCloudinary = async (formData) => {
  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dupp4u8uy/upload', // Replace YOUR_CLOUD_NAME with your actual Cloudinary cloud name
      formData,
      {
        params: {
            upload_preset: 'i4ptxc8q',
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export { uploadImageToCloudinary };


export const getImageUrlFromCloudinary = (uploadedImage) => {
    if (uploadedImage && uploadedImage.secure_url) {
      return uploadedImage.secure_url;
    }
    return null;
  };
  
