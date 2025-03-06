import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./examMarksInput.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import {  fetchCourseWiseMarksInput, fetchGetAllExamOptionsBatchWise, fetchGetSingleExamDetails } from "../../slice/examSlice";
import { fetchAllStudentsBatchWise } from "../../slice/studentSlice";

function ExamMarksInput() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [course, setCourse] = useState({});
  const [marks, setMarks] = useState([]);
  const [batchWiseResult, setBatchWiseResult] = useState([]);
  const [updatedStudents, setUpdatedStudents] = useState([]);
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

  const handleInputChange = (studentId, courseId, type, mark) => {
    let updatedMarks
    let student = []
    // Create a new array to update state immutably
    const updatedResults = batchWiseResult.map(student => {
        if (student.studentID === studentId) {
            return {
                ...student,
                courses: student.courses.map(course => {
                    if (course.courseId === courseId) {
                      updatedMarks = course.marks
                      // console.log(updatedMarks)
                        updatedMarks = {
                            ...updatedMarks, // Keep existing values
                            [type]: mark     // Update only the specified field (cq or mcq)
                        };
                        return {
                            ...course,
                            marks: {
                                ...course.marks,
                                [type]: mark 
                            }
                        };
                    }
                    return course;
                })
            };
            
        }
        return student;
    });
    setBatchWiseResult(updatedResults)
    
    // const inputData = {
    //   examId: exam,
    //   batchId: batch,
    //   courseId: courseId,
    //   students :[...students, {studentId: studentId, marks: updatedMarks}]
    // }
    // console.log(inputData)
    handlePayloadData(studentId, updatedMarks)
    
};
const handlePayloadData = (studentId, updatedMarks) => {
  setUpdatedStudents(prevState => {
      // Ensure prevState is always an array (in case it is not)
      const validPrevState = Array.isArray(prevState) ? prevState : [];

      // Check if the student already exists
      const updated = validPrevState.map(item => {
          if (item.studentId === studentId) {
              // Update the marks if the student exists
              return {
                  ...item,
                  marks: { ...item.marks, ...updatedMarks }
              };
          }
          return item;
      });

      // Check if the student does not exist and add the new student
      const studentExists = validPrevState.some(item => item.studentId === studentId);
      if (!studentExists) {
          return [
              ...updated,
              { studentId, marks: updatedMarks }
          ];
      }

      return updated;
  });
};


  

  const handleSubmit = () => {
    const inputData = {
        examId: exam,
        batchId: batch,
        courseId: selectedCourseId,
        students : updatedStudents
      }
    console.log(inputData)
    

    setLoading(true);
    dispatch(fetchCourseWiseMarksInput(inputData))
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
                      const selectedCourse = item.courses.find(c => c.courseId === selectedCourseId); // Find the course
                      
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
                                onChange={(e) =>
                                  handleInputChange(item.studentID, selectedCourseId, "cq", e.target.value)
                                }
                                />
                              </td>
                              <td>
                                <input
                                className="numberInput"
                                type="text"
                                value={selectedCourse.marks.mcq}
                                onChange={(e) =>
                                  handleInputChange(item.studentID, selectedCourseId, "mcq", e.target.value)
                                }
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
