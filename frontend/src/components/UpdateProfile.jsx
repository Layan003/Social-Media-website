import React, { useState } from 'react'
import { useUser } from '../UserContext'
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UpdateProfile.css'
import api from '../api';
import defaultImage from "../assets/images/default_img.jpg"

export default function UpdateProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(location.state?.profile || {});
    const {user} = useUser();
    const [profileImage, setProfileImage] = useState(profile.profile_img || null);
    const [name, setName] = useState(profile.name || "");
    const [bio, setBio] = useState(profile.bio || "");
    const [birthday, setBirthday] = useState(profile.birthday || null);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isDefaultImage, setIsDefaultImage] = useState(profileImage ? false : true);


    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setImageFile(file);

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!name.trim()) {
        alert("Name is required.");
        return;
    }
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (birthday){
        formData.append("birthday", birthday);
      }
      if (previewImage) {
        formData.append("profile_img", imageFile);
      }
      else {
        formData.append("profile_img", profileImage);
      }

      try {
        const res = await api.post("profile/update/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 200) {
          navigate('/')
        } else {
          alert("Failed to update profile. Please try again.");
        }
      } catch (error) {
        console.error(error);
      }
    };


  return (
    <div className="body">
      <div className="form-body">
        <form className="form-container" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-intro">
            <h1 className="form-title">Update your info</h1>
            <p>Please enter details below</p>
          </div>
          <div className="image-container">
            {
              isDefaultImage ? (<div
                className="profile-image"
                id="profileImage"
                style={{ backgroundImage: previewImage ? `url('${previewImage}')` : `url('${defaultImage}')` }}
              ></div>) : (<div
              className="profile-image"
              id="profileImage"
              style={{ backgroundImage: previewImage ? `url('${previewImage}')` : `url('http://localhost:8000${profileImage}')` }}
            ></div>)
            }
            
            <button
              type="button"
              className="edit-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Edit
            </button>
            <input
              type="file"
              name="profile-img"
              id="fileInput"
              className="file-input"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="inputs-container">
            <input
              type="text"
              name="name"
              placeholder="Full name:"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              name="bio"
              placeholder="Bio:"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <input
              type="date"
              className="username-input"
              name="birthday"
              placeholder="Birthday:"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <button type="submit" className="form-button">
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}
