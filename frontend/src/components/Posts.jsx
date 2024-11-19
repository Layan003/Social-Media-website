import React, { useState } from "react";
import { useEffect } from "react";
import api from "../api";
import { useUser } from "../UserContext";


export default function Posts() {
  const [posts, setPosts] = useState([]);
  const { user } = useUser();
  const [showPostComments, setShowPostComments] = useState(null);
  const [comment, setComment] = useState("");

  // post create
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get("posts/");
      if (res.status === 200) {
        setPosts(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);

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
    if (!content) {
      alert("you have to write something...")
      return
    }

    const formData = new FormData();
    formData.append('content', content)
    if(postImage) {
      formData.append('postImage', postImage)
    }
    try {
      const res = await api.post('post/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.status === 201){
        console.log("post created!!!")
        setPreviewImage(null);
        setPostImage(null);
        setContent('');
        fetchPosts();
      }
    }
    catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    
    fetchPosts();
  }, []);
  const handleDelete = async (postId) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (confirm) {
      try {
        const res = await api.post('post/delete/', {postId})
        if(res.status === 200){
          alert("post deleted successfully");
          fetchPosts();
        }        
      } catch (error) {
        console.error(error);
      }
    }
  }

  const goToProfile = () => {
    console.log("to profilelee");
  };

  const likePost = async (postId) => {
    try {
      const res = await api.post("like/", { postId });
      if (res.status === 200) {
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const showComment = async (postId) => {
    if (showPostComments === postId) {
      setShowPostComments(null);
    } else {
      setShowPostComments(postId);
    }
  };
  const submitComment = async (postId) => {
    try {
      const res = await api.post("comment/", { postId, comment });
      if (res.status === 201) {
        fetchPosts();
      } else {
        alert("error while creating the comment. Please try again...");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const res = await api.get(`user/${userId}`);
      // <Profile data=res.data.profile>

    }
    catch (error) {
      console.error(error);
    }



  }

  return (
    <div className="posts-section">
      {/* create post section */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="create-post-container"
        method="post"
      >
        <input
          className="create-post-input"
          type="text"
          name="content"
          placeholder="post something here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          name="post_image"
          accept="image/*"
          id="post_image"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div
          onClick={() => document.getElementById("post_image").click()}
          className="create-post-icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#818181"
          >
            <path d="M480-480ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h312v72H216v528h528v-312h72v312q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm48-144h432L552-480 444-336l-72-96-108 144Zm408-312v-72h-72v-72h72v-72h72v72h72v72h-72v72h-72Z" />
          </svg>
        </div>
        <button className="create-post-button" type="submit">
          Post
        </button>
      </form>
      {previewImage && (
          <div id="display-post-image" className="display-post-image">
            <img src={previewImage} alt="Preview" />
          </div>
        )}
      <hr className="horizontal-line" />

      {/* display posts section */}
      <div className="posts-body">
        {posts.map((post) => {
          const is_liked = post.likes.includes(user.id);
          return (
            <div className="post-card" key={post.id}>
              <div className="profile-img-container" onClick={goToProfile}>
                <div className="profile-img-intro" onClick={() => fetchUserData(post.user_id)}>
                <img
                  className="profile-img"
                  src={`http://localhost:8000${post?.profile_image}`}
                  alt=""
                />
                <div className="profile-user-container">
                  <p className="profile-name">{post.name}</p>
                  <p className="profile-username">@{post.username}</p>
                </div>
                </div>
                {post.user_id === user.id && (<div onClick={() => handleDelete(post.id)} className="delete-post-icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#818181"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                </div>)}
                
              </div>
              <p className="post-content">{post.content}</p>
              {post.post_image ? (
                <div className="post-image">
                  <img
                    src={`http://localhost:8000${post?.post_image}`}
                    alt=""
                  />
                </div>
              ) : (
                <span></span>
              )}

              {/* like/unlike icons */}
              <div className="icons">
                <div className="like-icon-container">
                  <p className="like-count">{(post.likes || []).length || 0}</p>
                  {is_liked ? (
                    <div
                      className="like-icon"
                      onClick={() => likePost(post.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#818181"
                      >
                        <path d="M718-313 604-426l57-56 57 56 141-141 57 56-198 198ZM440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Z" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      className="like-icon"
                      onClick={() => likePost(post.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#818181"
                      >
                        <path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q84 0 153 59t69 160q0 14-2 29.5t-6 31.5h-85q5-18 8-34t3-30q0-75-50-105.5T620-760q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm160-280v-80h320v80H600Z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="comment-icon-container">
                  <p className="comments-count">
                    {(post.comments || []).length || 0}
                  </p>
                  <div onClick={() => showComment(post.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#818181"
                    >
                      <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* comments section */}
              {showPostComments === post.id ? (
                <div className="comment-section">
                  {/* create comment section */}
                  <div className="create-comment-container">
                    <input
                      className="create-post-input"
                      type="text"
                      placeholder="Comment something here..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      className="create-comment-button"
                      onClick={() => submitComment(post.id)}
                    >
                      Comment
                    </button>
                  </div>
                  {/* <hr className="horizontal-line" /> */}
                  {/* end of create comment section */}

                  {/* start map comments  */}
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div className="comment" key={comment.id}>
                        <div className="profile-img-intro">
                          <img
                            className="profile-img"
                            src={`http://localhost:8000${comment.user.profile?.profile_img}`}
                            alt=""
                          />
                          <div className="profile-user-container">
                            <p className="profile-name">
                              {comment.user.profile?.name}
                            </p>
                            <p className="profile-username">
                              @{comment.username}
                            </p>
                          </div>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                        <hr className="comments-line" />
                      </div>
                    ))
                  ) : (
                    <p>There are no comments yet...</p>
                  )}
                </div>
              ) : (
                <span></span>
              )}
              {/* end of comment section */}

              <hr className="horizontal-line" />
            </div>
          );
        })}
      </div>
    </div>
  );
}