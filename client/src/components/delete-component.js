import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course-service";

const DeleteComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [searchInput, setSearchInput] = useState("");
  let [searchResult, setSearchResult] = useState(null);
  let [searchInputTitle, setSearchInputTitle] = useState("");
  let [searchInputDescription, setSearchInputDescription] = useState("");
  let [searchInputPrice, setSearchInputPrice] = useState("");

  const handleTakeToLogin = () => {
    navigate("/login");
  };
  const handleChangeInput = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearch = () => {
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        console.log(data);
        setSearchResult(data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDelete = (e) => {
    CourseService.delete(e.target.id)
      .then(() => {
        window.alert("課程刪除成功。重新導向到課程頁面。");
        navigate("/course");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>請先登入在刪除課程</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            回到登入頁面
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>只有講師才能刪除課程</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            className="form-control"
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {currentUser && searchResult && searchResult.length != 0 && (
        <div>
          <p>我們從 API 返回的數據。</p>
          {searchResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">課程名稱：{course.title}</h5>
                <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                  {course.description}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>價格: {course.price}</p>
                <p style={{ margin: "0.5rem 0rem" }}>
                  目前的學生人數: {course.students.length}
                </p>
                <p style={{ margin: "0.5rem 0rem" }}>
                  講師: {course.instructor.username}
                </p>
                <a
                  href="#"
                  onClick={handleDelete}
                  className="card-text btn btn-primary"
                  id={course._id}
                >
                  刪除課程
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteComponent;
