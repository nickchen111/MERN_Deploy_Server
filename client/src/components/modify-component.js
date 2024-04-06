import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course-service";

const ModifyComponent = ({ currentUser, setCurrentUser }) => {
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
  const handleChangeInputTitle = (e) => {
    setSearchInputTitle(e.target.value);
  };
  const handleChangeInputDescription = (e) => {
    setSearchInputDescription(e.target.value);
  };
  const handleChangeInputPrice = (e) => {
    setSearchInputPrice(e.target.value);
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
  const handleModify = async () => {
    let idFound = await CourseService.get(
      JSON.parse(localStorage.getItem("user")).user._id
    );
    let _id;

    for (let i = 0; i < idFound.data.length; i++) {
      if (idFound.data[i].title == searchInput) {
        _id = idFound.data[i]._id;
      }
    }
    CourseService.modify(
      searchInputTitle,
      searchInputDescription,
      searchInputPrice,
      _id
    )
      .then(() => {
        window.alert("課程更新成功。重新導向到課程頁面。");
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
          <p>請先登入在更改課程</p>
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
          <h1>只有講師才能更改課程</h1>
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
          <div className="card" style={{ width: "18rem" }}>
            <div className="card-body">
              <h5 className="card-title">
                課程名稱：<input onChange={handleChangeInputTitle}></input>
              </h5>
              <p className="card-text" style={{ margin: "0.5rem 0rem" }}>
                課程描述:
                <input onChange={handleChangeInputDescription}></input>
              </p>
              <p style={{ margin: "0.5rem 0rem" }}>
                價格: <input onChange={handleChangeInputPrice}></input>
              </p>

              <a
                href="#"
                onClick={handleModify}
                className="card-text btn btn-primary"
                titles={searchInput}
              >
                更改課程
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyComponent;
