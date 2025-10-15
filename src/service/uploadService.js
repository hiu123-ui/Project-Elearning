import axios from "axios";

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Project_Elearning");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dwle4noir/image/upload",
      formData
    );
    return res.data.secure_url;
  },
};
