import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageList, setImageList] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/list-files");
      setImageList(response.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    try {
      // Get authentication details
      const authResponse = await axios.get("http://localhost:5000/auth");
      const { signature, expire, token, publicKey } = authResponse.data;

      // Prepare FormData
      const formData = new FormData();
      formData.append("file", image); // The image file
      formData.append("fileName", "upload"); // Any name you want
      formData.append("folder", "/upload"); // Specify the folder in ImageKit
      formData.append("signature", signature); // From the backend
      formData.append("expire", expire); // From the backend
      formData.append("token", token); // From the backend
      formData.append("publicKey", publicKey); // From the backend

      // Debugging: Log FormData
      formData.forEach((value, key) => console.log(`${key}:`, value));

      // Upload file to ImageKit
      const uploadResponse = await axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        formData
      );

      setUploadedImageUrl(uploadResponse.data.url); // Set the uploaded image URL
      alert("Image uploaded successfully!");
      fetchImages(); // Refresh image list after upload
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      alert("Failed to upload image. Check console for details.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Upload Image to ImageKit</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadedImageUrl && (
        <div>
          <h2>Uploaded Image</h2>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ width: "300px" }} />
        </div>
      )}
      {imageList.length > 0 && (
        <div>
          <h2>All Uploaded Images</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {imageList.map((img) => (
              <img
                key={img.fileId}
                src={img.url}
                alt={img.name}
                style={{ width: "150px", height: "auto", border: "1px solid #ccc" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
