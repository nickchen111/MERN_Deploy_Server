const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("courseRoute正在接受request");
  next();
});

//新增課程
router.post("/", async (req, res) => {
  //驗證數據符合規範
  let { error } = courseValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  if (req.user.isStudent()) {
    return res
      .status(400)
      .send("只有講師才能發佈新課程 如果你已經是講師 請透過講師帳號登入");
  }
  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savedCourse = await newCourse.save();
    return res.send({ message: "新課程已經保存", savedCourse });
  } catch (e) {
    return res.status(500).send("無法創建課程");
  }
});

//列出所有的課程
router.get("/", async (req, res) => {
  // query object -> populate 可以再找到的東西裡面去指定屬性 然後看這個屬性的值可以連結到的哪些資料並且把他附加到現在的資訊裡面
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用課程id尋找課程
router.get("/:_id", async (req, res) => {
  try {
    let { _id } = req.params;
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();

    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用課程名稱來尋找課程
router.get("/findByName/:name", async (req, res) => {
  try {
    let { name } = req.params;
    let courseFound = await Course.find({ title: name })
      .populate("instructor", ["email", "username"])
      .exec();
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

//用學生id來尋找註冊的課程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();

  return res.send(coursesFound);
});

// 用講師id尋找課程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 讓學生透過課程id來註冊新課程
router.post("/enroll/:_id", async (req, res) => {
  //驗證數據符合規範
  let { _id } = req.params;
  try {
    let course = await Course.findOne({ _id }).exec();
    // course-route被jwt保護 所以使用著帶著token的話 req.user就有使用者資訊

    for (let i = 0; i < course.students.length; i++) {
      if (course.students[i] == req.user._id) {
        return res.send("註冊失敗 您已註冊過該課程");
      }
    }
    course.students.push(req.user._id);
    await course.save();
    return res.send("註冊成功");
  } catch (e) {
    return res.send(e);
  }
});

// 講師編輯課程
router.patch("/:_id", async (req, res) => {
  // 驗證數據符合規範

  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { _id } = req.params;

  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("找不到課程。無法更新課程內容。");
    }
    // 使用者必須是此課程講師，才能編輯課程

    if (courseFound.instructor.equals(req.user._id)) {
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        message: "課程已經被更新成功",
        updatedCourse,
      });
    } else {
      return res.status(403).send("只有此課程的講師才能編輯課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

//講師刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  // 確認課程存在
  try {
    let courseFound = await Course.findOne({ _id }).exec();
    if (!courseFound) {
      return res.status(400).send("找不到課程。無法刪除課程。");
    }

    // 使用者必須是此課程講師，才能刪除課程
    if (courseFound.instructor.equals(req.user._id)) {
      await Course.deleteOne({ _id }).exec();
      return res.send("課程已被刪除。");
    } else {
      return res.status(403).send("只有此課程的講師才能刪除課程。");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
