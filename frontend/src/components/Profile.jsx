import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/images/default_img.jpg";
import { useParams } from "react-router-dom";
import api from "../api";

export default function Profile({ profile, followers, followings, fetchFollowCount }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(null);
  const { userId } = useParams();


  const fetchFollowed = async () => {
    if (userId) {
      if (userId !== user.id) {
        try {
          const res = await api.get(`follow/${userId}/`);
          // console.log(res.status);
          if (res.data.message === "followed") {
            setIsFollowed(true);
          } else if (res.data.message === "not followed") {
            setIsFollowed(false);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  useEffect(() => {
    fetchFollowed();
    // console.log(isFollowed);
  }, []);

  const handleProfileEdit = async () => {
    return navigate("/profile/update", { state: { profile } });
  };

  const handleFollow = async () => {
    if (userId) {
      if (userId !== user.id) {
        try {
          const res = await api.post(`follow/${userId}/`);
          if (res.status === 201 || res.status === 200) {
            // console.log(res.data.message);
            // const action = !isFollowed;
            setIsFollowed(!isFollowed);
            fetchFollowCount(userId);

          }
          // console.log(res.status);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  return (
    <div className="profile-body">
      <div className="profile-card">
        <div className="profile-img-container">
          <div className="profile-img-intro">
            {profile.profile_img ? (
              <img
                className="profile-img"
                src={`http://localhost:8000${profile?.profile_img}`}
                alt="profile image"
              />
            ) : (
              <img
                className="profile-img"
                src={defaultImage}
                alt="profile image"
              />
            )}

            <div className="profile-user-container">
              <p className="profile-name">{profile?.name}</p>
              <p className="profile-username">@{profile.username}</p>
            </div>
          </div>

          {profile.user === user.id ? (
            <div className="edit-profile-icon" onClick={handleProfileEdit}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#818181"
              >
                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
              </svg>
            </div>
          ) : // check if follow/unfollow
          isFollowed ? (
            <div className="edit-profile-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#818181"
                onClick={handleFollow}
              >
                <path d="M640-520v-80h240v80H640Zm-280 40q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
              </svg>
            </div>
          ) : (
            <div className="edit-profile-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#818181"
                onClick={handleFollow}
              >
                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
              </svg>
            </div>
          )}
        </div>

        {/* followers - following */}
        <div className="profile-follow">
          <p className="profile-following">{followings} Following</p>
          <p className="profile-followers">{followers} Followers</p>
        </div>
        <hr className="horizontal-line" />

        {/* Bio */}
        {profile.bio && (
          <div>
            <div className="bio-container">
              <p className="bio">{profile?.bio}</p>
            </div>
            <hr className="horizontal-line" />
          </div>
        )}

        {profile.birthday && (
          <div className="profile-info">
            <div className="birthday-container">
              <div className="birthday-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#818181"
                >
                  <path d="M192-96q-20.4 0-34.2-13.8Q144-123.6 144-144v-192q0-29.7 21.15-50.85Q186.3-408 216-408h24v-168q0-29.7 21.15-50.85Q282.3-648 312-648h132v-54q-17-12-26.5-25t-9.5-35.77q0-14.23 5-26.73t15.94-23.44L480-864l51.88 51.06Q543-802 547.5-789.5q4.5 12.5 4.5 26.73 0 22.77-9.5 35.77-9.5 13-26.5 25v54h132q29.7 0 50.85 21.15Q720-605.7 720-576v168h24q29.7 0 50.85 21.15Q816-365.7 816-336v192q0 20.4-13.8 34.2Q788.4-96 768-96H192Zm120-312h336v-168H312v168Zm-96 240h528v-168H216v168Zm96-240h336-336Zm-96 240h528-528Zm528-240H216h528Z" />
                </svg>
              </div>

              <input
                className="birthday"
                type="birthday"
                value={profile?.birthday}
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
