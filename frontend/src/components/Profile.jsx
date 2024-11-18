import React from 'react'
import { useEffect, useState } from 'react';
import api from '../api';
import { useUser } from '../UserContext';

export default function Profile() {
  const [data, setData] = useState(null);
  const {user} = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('profile/');
        if (res.status === 200) {
          setData(res.data);
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    fetchProfile();
  }, [])


  return (
    <div className="profile-body">
      <div className="profile-card">
        <div className="profile-img-container">
          <img
            className="profile-img"
            src={`http://localhost:8000${data?.profile_img}`}
            alt="profile image"
          />
          <div className="profile-user-container">
            <p className="profile-name">{data?.name}</p>
            <p className="profile-username">@{user.username}</p>
          </div>
        </div>

        {/* followers - following */}
        <div className="profile-follow">
          <p className="profile-following">143 Following</p>
          <p className="profile-followers">20 Followers</p>
        </div>
        <hr className="horizontal-line" />

        {/* Bio */}
        <div className="bio-container">
          <p className="bio">{data?.bio}</p>
        </div>
        <hr className="horizontal-line" />

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
              value={data?.birthday}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
