import React, { useState } from "react";
import api from "../api";
import { useUser } from "../UserContext";
import { useNavigate, useParams } from "react-router-dom";
import defaultImage from "../assets/images/default_img.jpg"

export default function Posts({ posts, setReload, fetchPosts }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showPostComments, setShowPostComments] = useState(null);
  const [comment, setComment] = useState("");
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const { userId } = useParams();

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
      alert("you have to write something...");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);
    if (postImage) {
      formData.append("postImage", postImage);
    }
    try {
      const res = await api.post("post/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        // console.log("post created!!!");
        setPreviewImage(null);
        setPostImage(null);
        setContent("");
        setReload((reload) => !reload);
        fetchPosts()
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (postId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirm) {
      try {
        const res = await api.post("post/delete/", { postId });
        if (res.status === 200) {
          alert("post deleted successfully");
          setReload((reload) => !reload);
          fetchPosts();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const likePost = async (postId) => {
    try {
      const res = await api.post("like/", { postId });
      if (res.status === 200) {
        setReload((reload) => !reload);
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
      setReload((reload) => !reload);
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
        setReload((reload) => !reload);
        fetchPosts();
      } else {
        alert("error while creating the comment. Please try again...");
      }
    } catch (error) {
      console.error(error);
    }finally {
      setComment('')
    }
  };

  const handleFetchProfile = (userId) => {
    navigate(`/${userId}`);
    setReload((reload) => !reload);
  };

  return (
    <div className="posts-section bg-white p-3 md:col-span-2 sm:my-4 md:my-0 rounded-lg shadow-md h-fit">
      {/* create post section */}
      {(userId && (userId == user.id)) || !userId ? (
         <div>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="create-post-container flex justify-between w-full border border-gray-900 shadow-md rounded-lg mb-3"
          method="post"
        >
          <input
            className="create-post-input p-2 border-0 outline-0"
            // style={{border: 'none'}}
            type="text"
            name="content"
            placeholder="post something here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center gap-3">
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
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20px"
              className="hover:cursor-pointer hover:opacity-50 transition-all"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#818181"
            >
              <path d="M480-480ZM216-144q-29.7 0-50.85-21.15Q144-186.3 144-216v-528q0-29.7 21.15-50.85Q186.3-816 216-816h312v72H216v528h528v-312h72v312q0 29.7-21.15 50.85Q773.7-144 744-144H216Zm48-144h432L552-480 444-336l-72-96-108 144Zm408-312v-72h-72v-72h72v-72h72v72h72v72h-72v72h-72Z" />
            </svg>
          </div>
          
          <button className="create-post-button bg-gray-200 border-0 h-full rounded-lg px-4 hover:bg-gray-400 transition-all " type="submit">
            Post
          </button>
          </div>
        </form>
        {previewImage && (
        <div id="display-post-image" className="display-post-image">
            <img src={previewImage} alt="Preview" className="rounded-lg h-[300px] w-[100%] object-cover" />
        </div>
        )}
        <hr className="horizontal-line" />
      </div>
      ) : (
        <span></span>
      )}

      {/* display posts section */}
      <div className="posts-body">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const is_liked = post.likes.includes(user.id);
            return (
              <div className="post-card" key={post.id}>
                <div className="profile-img-container flex justify-between">
                  <div
                    className="profile-img-intro flex gap-2 hover:cursor-pointer"
                    onClick={() => handleFetchProfile(post.user)}
                  >
                    {post.profile_image ? (
                      <img
                        className="profile-img rounded-full w-[50px] h-[50px]"
                        src={`http://localhost:8000${post.profile_image}`}
                        alt=""
                      />
                    ) : (
                      <img className="profile-img" src={defaultImage} alt="" />
                    )}

                    <div className="profile-user-container">
                      <p className="profile-name mb-0 text-md font-semibold">{post.name}</p>
                      <p className="profile-username text-gray-500 text-sm">@{post.username}</p>
                    </div>
                  </div>
                  {post.user === user.id && (
                    <div
                      onClick={() => handleDelete(post.id)}
                      className="delete-post-icon"
                    >
                      <img src="/trash.svg" alt="" width={18} className="opacity-70 hover:opacity-40 hover:cursor-pointer"  />
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#818181"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg> */}
                    </div>
                  )}
                </div>
                <p className="post-content mx-3">{post.content}</p>
                {post.post_image ? (
                  <div className="post-image mx-3">
                    <img
                      src={`http://localhost:8000${post?.post_image}`}
                      alt=""
                      className="rounded-lg h-[300px] w-[100%] object-cover"
                    />
                  </div>
                ) : (
                  <span></span>
                )}

                {/* like/unlike icons */}
                <div className="icons mx-3 my-2 flex items-center gap-2 ">
                  <div className="like-icon-container flex items-center gap-1">
                    <p className="like-count m-0">
                      {(post.likes || []).length || 0}
                    </p>
                    {is_liked ? (
                      <div
                        className="like-icon"
                        onClick={() => likePost(post.id)}
                      >
                        <svg
                          className="hover:cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#818181"
                        >
                          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                        </svg>
                      </div>
                    ) : (
                      <div
                        className="like-icon"
                        onClick={() => likePost(post.id)}
                      >
                        <svg
                          className="hover:cursor-pointer"

                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#818181"
                        >
                          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="comment-icon-container flex items-center gap-1">
                    <p className="comments-count m-0">
                      {(post.comments || []).length || 0}
                    </p>
                    <div onClick={() => showComment(post.id)} className="flex justify-center items-center ">
                      <svg
                      className="hover:cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#818181"
                      >
                        <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* comments section */}
                {showPostComments === post.id ? (
                  <div className="comment-section mx-3">
                    {/* create comment section */}
                    <div className="create-comment-container flex justify-between rounded-lg shadow-md border">
                      <input
                        className="create-post-input p-2 border-0 outline-0 w-full"
                        type="text"
                        placeholder="Comment something here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        className="create-comment-button bg-gray-200 border-0 rounded-lg px-4 hover:bg-gray-400 transition-all"
                        onClick={() => submitComment(post.id)}
                      >
                        Comment
                      </button>
                    </div>
                    {/* end of create comment section */}

                    {/* start map comments  */}
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div className="comment my-3" key={comment.id}>
                          <div className="profile-img-intro flex gap-2 hover:cursor-pointer">
                            <img
                              className="profile-img rounded-full w-[50px] h-[50px]"
                              src={`http://localhost:8000${comment.profile_img}`}
                              alt=""
                            />
                            <div className="profile-user-container">
                              <p className="profile-name mb-0 font-semibold">{comment.name}</p>
                              <p className="profile-username text-sm">
                                @{comment.username}
                              </p>
                            </div>
                          </div>
                          <p className="comment-content mx-3">{comment.content}</p>
                          <hr className="comments-line" />
                        </div>
                      ))
                    ) : (
                      <p className="m-2 text-gray-600">There are no comments yet...</p>
                    )}
                  </div>
                ) : (
                  <span></span>
                )}
                {/* end of comment section */}

                <hr className="horizontal-line" />
              </div>
            );
          })
        ) : (
          <p>user has no posts...</p>
        )}
      </div>
    </div>
  );
}
