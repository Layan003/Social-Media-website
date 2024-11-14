import React from 'react'

export default function Posts() {
  return (
    <div className="posts-section">
      
      <div className="create-post-container">
        <input
          className="create-post-input"
          type="text"
          placeholder="post something here..."
        />
        <button className="create-post-button">Post</button>
      </div>
      <hr className="horizontal-line" />

      <div className="posts-body">
        <div className="post-card">
          <div className="profile-img-container">
            <img className="profile-img" src='#' alt="" />
            <div className="profile-user-container">
              <p className="profile-name">Lorem ipsum</p>
              <p className="profile-username">@Lorem</p>
            </div>
          </div>
          <p className="post-content">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero sit
            iste perferendis laboriosam quaerat suscipit, fugit deleniti laborum
            labore ea recusandae maxime error aliquam obcaecati assumenda
            placeat velit ullam culpa.
          </p>

          <button className="see-comments-btn">See comments</button>
          <div className="comment-section">
            <div className="comment">
              <p className="comment-name">Lorem ipsum</p>
              <p className="comment-content">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              </p>
              <hr className="comments-line" />
            </div>
          
          </div>
          <hr className="horizontal-line" />
        </div>
        
        {/* end of posts map */}
      </div>
    </div>
  );
}
