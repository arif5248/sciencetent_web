import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./examMarksInput.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchBatchWiseMarksInput, fetchGetAllExamOptionsBatchWise, fetchGetSingleExamDetails } from "../../slice/examSlice";
import { fetchAllStudentsBatchWise } from "../../slice/studentSlice";

function ExamMarksInput() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [course, setCourse] = useState({});
  const [marks, setMarks] = useState([]);
  const [batchWiseResult, setBatchWiseResult] = useState([]);
  const [examDetails, setExamDetails] = useState({});

  const [batch, setBatch] = useState("");
  const [exam, setExam] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showExamSelectBox, setShowExamSelectBox] = useState(false);
  const [showCourseSelectBox, setShowCourseSelectBox] = useState(false);
  const [showMarksSheet, setShowMarksSheet] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Fetch batches on component mount
    dispatch(fetchAllBatchForReg())
      .unwrap()
      .then((response) => {
        setBatchOptions(response.batches || []);
      })
      .catch((err) => {
        console.log(err)
        setErrorMessage("Failed to load batches. Please try again.");
      });
  }, [dispatch]);

  const handleBatch = (batchId) => {
    setBatch(batchId);
    setShowExamSelectBox(false);
    setShowMarksSheet(false);
    setStudents([]);
    setMarks([]);
    setExamOptions([]);
    setExam("");

    if (!batchId) return;

    setLoading(true);
    dispatch(fetchGetAllExamOptionsBatchWise(batchId))
      .unwrap()
      .then((response) => {
        setExamOptions(response.exams || []);
        setShowExamSelectBox(true);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to load data.");
      })
      .finally(() => setLoading(false));
  };
  const handleExam = (examId) => {
    setExam(examId);
    console.log(examId)
    setShowMarksSheet(false);

    dispatch(fetchGetSingleExamDetails(examId))
      .unwrap()
      .then((response) => {
        setExamDetails(response.exams);
        setCourseOptions(response.exam.courses)
        setBatchWiseResult((response.exam.result.find(item => item.batchId === batch).batchWiseResult))
        setShowCourseSelectBox(true);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to load data.");
      })
      .finally(() => setLoading(false));
  };

  const handleCourse = (courseId) => {
    setSelectedCourseId(courseId)
    setCourse(courseOptions.find(course => course.course === courseId))
    setShowMarksSheet(true);
    console.log(batchWiseResult)
    
  };
  

  // useEffect(() => {
  //   if (students.length > 0 && courses.length > 0) {
  //     const initialMarks = students.map((student) => ({
  //       id: student.id,
  //       studentId: student.studentID,
  //       studentName: student.name,
  //       courseMarks: courses.reduce((acc, course) => {
  //         acc[course.id] = ""; // Initialize marks as empty
  //         return acc;
  //       }, {}),
  //       total: 0,
  //     }));
  //     setMarks(initialMarks);
  //   }
  // }, [students, courses]);

  const handleInputChange = (studentId, courseId, value) => {
    const updatedMarks = marks.map((mark) => {
      if (mark.studentId === studentId) {
        const updatedCourseMarks = {
          ...mark.courseMarks,
          [courseId]: value.trim(), // Accept both numeric and string inputs
        };
        const total = Object.values(updatedCourseMarks).reduce(
          (sum, mark) => (isNaN(parseFloat(mark)) ? sum : sum + parseFloat(mark)),
          0
        );
        return { ...mark, courseMarks: updatedCourseMarks, total };
      }
      return mark;
    });
    setMarks(updatedMarks);
  };
  

  const handleSubmit = () => {
    // console.log(courses)
    const transformedData = marks.map((mark) => ({
      student: mark.id,
      // courses: courses.map((course) => ({
      //   courseId: course.id,
      //   courseName : course.name,
      //   marks: mark.courseMarks[course.id] === '' ? "0" :mark.courseMarks[course.id],
      // })),
    }));

    const requestData = {
      examId: exam,
      allMarks: {
        batchId:batch,
        batchWiseResult: transformedData
      },
    };

    setLoading(true);
    dispatch(fetchBatchWiseMarksInput(requestData))
      .unwrap()
      .then((response) => {
        setSuccessMessage(response.message || "Marks submitted successfully!");
        setTimeout(() => setSuccessMessage(null), 5000);
      })
      .catch((err) => {
        console.log(err)
        setErrorMessage(err.message || err || "Failed to submit marks.");
        setTimeout(() => setErrorMessage(null), 5000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <MetaData title="Exam Marks Input" />
      <div className="examMarksInputSection">
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <div className="selectBatchAndExam">
              <div className="form-group">
                <select value={batch} onChange={(e) => handleBatch(e.target.value)}>
                  <option value="">Select Batch</option>
                  {batchOptions.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
              {showExamSelectBox && (
                <div className="form-group">
                  <select value={exam} onChange={(e) => handleExam(e.target.value)}>
                    <option value="">Select Exam</option>
                    {examOptions.map((exam) => (
                      <option key={exam._id} value={exam._id}>
                        {exam.examCode}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {showCourseSelectBox && (
                <div className="form-group">
                  <select value={selectedCourseId} onChange={(e) => handleCourse(e.target.value)}>
                    <option value="">Select Course</option>
                    {courseOptions.map((course) => (
                      <option key={course.course} value={course.course}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            {showMarksSheet && (
              <div className="marksInputSection">
                <table className="marksInputTable">
                  <thead>
                    <tr>
                      <th rowSpan={2}>ID</th>
                      <th rowSpan={2}>Name</th>
                      <th colSpan={3}>{course.courseName}</th>
                    </tr>
                    <tr>
                      <th>CQ (out of {course.marks.cq})</th>
                      <th>MCQ (out of {course.marks.mcq})</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    batchWiseResult.map((item) => {
                      console.log("+++++++",course)
                      const selectedCourse = item.courses.find(c => c.courseId === selectedCourseId); // Find the course
                      console.log(selectedCourse)
                      return (
                        <tr key={item.studentID}>
                          <td>{item.studentID}</td>
                          <td>{item.studentName}</td>
                          {selectedCourse ? (
                            <>
                              <td>
                                <input
                                className="numberInput"
                                type="text"
                                value={selectedCourse.marks.cq}
                                // onChange={(e) =>
                                //   handleInputChange(mark.studentId, course.id, e.target.value)
                                // }
                                />
                              </td>
                              <td>
                                <input
                                className="numberInput"
                                type="text"
                                value={selectedCourse.marks.mcq}
                                // onChange={(e) =>
                                //   handleInputChange(mark.studentId, course.id, e.target.value)
                                // }
                                />
                              </td>
                              <td>
                                {selectedCourse.marks.cq !== "null" && selectedCourse.marks.mcq !== "null"
                                  ? Number(selectedCourse.marks.cq) + Number(selectedCourse.marks.mcq)
                                  : 0}
                              </td>
                            </>
                          ) : (
                            <>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                            </>
                          )}
                        </tr>
                      );
                    })
                  }


                    {/* {marks.map((mark) => (
                      <tr key={mark.studentId}>
                        <td>{mark.studentId}</td>
                        {courses.map((course) => (
                          <td key={course.id}>
                            <input
                              className="numberInput"
                              type="text"
                              value={mark.courseMarks[course.id]}
                              onChange={(e) =>
                                handleInputChange(mark.studentId, course.id, e.target.value)
                              }
                            />
                          </td>
                        ))}
                        <td>{mark.total}</td>
                      </tr>
                    ))} */}
                  </tbody>
                </table>
                <button onClick={handleSubmit}>Submit Marks</button>
              </div>
            )}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default ExamMarksInput;
