import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./examMarksInput.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchBatchWiseMarksInput, fetchGetAllExamBatchWise } from "../../slice/examSlice";
import { fetchAllStudentsBatchWise } from "../../slice/studentSlice";

function ExamMarksInput() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [batchOptions, setBatchOptions] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [marks, setMarks] = useState([]);

  const [batch, setBatch] = useState("");
  const [exam, setExam] = useState("");
  const [showExamSelectBox, setShowExamSelectBox] = useState(false);
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
      .catch(() => {
        setErrorMessage("Failed to load batches. Please try again.");
      });
  }, [dispatch]);

  const handleBatch = (batchId) => {
    setBatch(batchId);
    setShowExamSelectBox(false);
    setShowMarksSheet(false);
    setStudents([]);
    setCourses([]);
    setMarks([]);

    if (!batchId) return;

    setLoading(true);
    dispatch(fetchGetAllExamBatchWise(batchId))
      .unwrap()
      .then((response) => {
        setExamOptions(response.exams || []);
        setShowExamSelectBox(true);
        return dispatch(fetchAllStudentsBatchWise(batchId)).unwrap();
      })
      .then((response) => {
        const studentData = response.students.map((student) => ({
          id: student._id,
          name: student.name,
          studentID: student.studentID,
        }));
        setStudents(studentData);
      })
      .catch((err) => {
        setErrorMessage(err.message || "Failed to load data.");
      })
      .finally(() => setLoading(false));
  };

  const handleExam = (examId) => {
    setExam(examId);
    setShowMarksSheet(false);
    const selectedExam = examOptions.find((exam) => exam._id === examId);
    const isExist = selectedExam.result.filter((item) => batch === item.batchId.toString());

    console.log(isExist)
    if (selectedExam && isExist.length ===0) {
      const courseData = selectedExam.courses.map((course) => ({
        id: course.course,
        name: course.courseName,
        maxMarks: course.marks,
      }));
      setCourses(courseData);
      setShowMarksSheet(true);
    }else{
      setErrorMessage("The marks are inputted already for this batch.")
    }
  };

  useEffect(() => {
    if (students.length > 0 && courses.length > 0) {
      const initialMarks = students.map((student) => ({
        id: student.id,
        studentId: student.studentID,
        studentName: student.name,
        courseMarks: courses.reduce((acc, course) => {
          acc[course.id] = ""; // Initialize marks as empty
          return acc;
        }, {}),
        total: 0,
      }));
      setMarks(initialMarks);
    }
  }, [students, courses]);

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
    const transformedData = marks.map((mark) => ({
      student: mark.id,
      courses: courses.map((course) => ({
        courseId: course.id,
        marks: mark.courseMarks[course.id],
      })),
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
        setErrorMessage(err.message || "Failed to submit marks.");
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
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            {showMarksSheet && (
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      {courses.map((course) => (
                        <th key={course.id}>{course.name} (out of {course.maxMarks})</th>
                      ))}
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((mark) => (
                      <tr key={mark.studentId}>
                        <td>{mark.studentId}</td>
                        {courses.map((course) => (
                          <td key={course.id}>
                            <input
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
                    ))}
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
