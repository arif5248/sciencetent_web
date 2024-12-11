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
  const [batchesError, setBatchesError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [batchOptions, setBatchOptions] = useState([]); 
  const [examOptions, setExamOptions] = useState([]);
  const [showExamSelectBox, setShowExamSelectBox] = useState(false);
  const [showMarksShit, setShowMarksShit] = useState(false);

  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState([])
  
  const [batch, setBatch] = useState("");
  const [exam, setExam] = useState("");

  const handleBatch = (batchId) => {
    setLoading(true);
    setBatch(batchId);
    setShowExamSelectBox(false);
    setMarks([])
    dispatch(fetchGetAllExamBatchWise(batchId))
      .unwrap()
      .then((response) => {
        setSuccessMessage("All Exams fetched successfully!");
        
        setExamOptions(response.exams);
  
        if (response.success === true) {
          setShowExamSelectBox(true);
        }
  
        // Call the second API
        return dispatch(fetchAllStudentsBatchWise(batchId)).unwrap();
      })
      .then((studentResponse) => {
        setStudents([])
        setSuccessMessage("All Students fetched successfully!");
        const allStudents = studentResponse.students;
        const updatedStudents = allStudents.map((student) => ({
          id: student._id,
          name: student.name,
          studentID: student.studentID
        })); // Assuming you want to store students in state
        setStudents(updatedStudents)
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((err) => {
        setErrorMessage(err);
        setTimeout(() => {
          setErrorMessage(null);
        }, 20000);
      })
      .finally(() => setLoading(false));
  };
  
  const handleBatchAndExamData = (examId) => {
    setExam(examId);
    setCourses([]); // Clear courses first
    
    const selectedExam = examOptions.find((exam) => exam._id === examId);
    
    console.log(selectedExam)
    if(selectedExam && selectedExam.result.length !== 0){
      selectedExam.result.map((exam)=>{
        exam.courses.map((course)=>{
          console.log("asi gechi")
          handleInputChange(exam.student, course._id, course.marks)
        })
      })
      console.log("baaaaaaal",marks)
    }
    // Use a temporary array to accumulate the updated courses
    // console.log(selectedExam.courses)
    const updatedCourses = selectedExam.courses.map((course) => ({
      
      id: course.course,
      name: course.courseName,
      marks: course.marks,
    }));
  
    // Set the accumulated courses to state
    setCourses(updatedCourses);
  
    setShowMarksShit(true);
  };
  
  useEffect(() => {
    dispatch(fetchAllBatchForReg())
      .then((response) => {
        if (response.error) {
          setBatchesError("Failed to load batches. Please try again.");
        } else {
          setBatchOptions(response.payload.batches);
          setBatchesError(null);
        }
      })
      .catch(() => setBatchesError("Failed to load batches. Please try again."));

    
  }, [dispatch]);

  // State to hold marks
  useEffect(() => {
    // Perform actions dependent on students state
    if (students.length > 0) {
      setMarks([])
      setMarks(
        students.map((student) => ({
          id: student.id,
          studentId: student.studentID,
          studentName: student.name,
          courseMarks: courses.reduce((acc, course) => {
            acc[course.id] = "";
            return acc;
          }, {}),
          total: 0,
        }))
      );
    }else{
      setMarks([])
    }
  }, [students, courses]); // Trigger when students or courses change

  // Handle input change
  const handleInputChange = (studentId, courseId, value) => {
    
    const updatedMarks = marks.map((mark) => {
      if (mark.studentId === studentId) {
        const updatedCourseMarks = { ...mark.courseMarks, [courseId]: value };
        const total = Object.values(updatedCourseMarks).reduce(
          (sum, mark) => sum + (parseFloat(mark) || 0),
          0
        );
        return { ...mark, courseMarks: updatedCourseMarks, total };
      }
      return mark;
    });
    setMarks(updatedMarks);
  };

  // Handle submit
  const handleSubmit = () => {
    
    const transformedData = marks.map((mark) => ({
      student: mark.id, // Student ID (ObjectId)
      courses: courses.map((course) => ({
        course: course.course, // Course ID (ObjectId)
        // marks: parseFloat(mark.courseMarks[course.id]) || 0,
        marks: mark.courseMarks[course.id],
      })),
      batch, // Batch ID (ObjectId)
    }));
  
    const marksData= {
      examId: exam,
      allMarks : transformedData
    }
    // console.log("Transformed Data for Submission:", marksData);
    setLoading(true)
    dispatch(fetchBatchWiseMarksInput(marksData))
      .unwrap()
      .then((response) => {
        // console.log()
        setStudents([])
        setSuccessMessage(response.message ? response.message : "Marks are inputted successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })
      .catch((err) => {
        setErrorMessage(err);
        setTimeout(() => {
          setErrorMessage(null);
        }, 20000);
      })
      .finally(() => setLoading(false));
  
    
  };
  return (
    <Fragment>
      <MetaData title="Exam Marks Input" />
      <div className="examMarksInputSection">
        {/* <h2>Input Marks</h2> */}
        {loading  ? (
          <Loader />
        ) : ( 
            <Fragment>
              <div className="selectBatchAndExam">
                  <div className="form-group animated">
                      {/* <label>Select Batch</label> */}
                      <select value={batch} onChange={(e) => handleBatch(e.target.value)} required>
                          <option value="">Select Batch</option>
                          {batchOptions.map((batch) => (
                          <option key={batch._id} value={batch._id}>
                              {batch.name}
                          </option>
                          ))}
                      </select>
                      {batchesError && <p className="error">{batchesError}</p>}
                  </div>
                  {showExamSelectBox && <div className="form-group animated">
                      {/* <label>Select Exam</label> */}
                      <select value={exam} onChange={(e) => handleBatchAndExamData(e.target.value)} required>
                          <option value="">Select Exam</option>
                          {examOptions.map((exam) => (
                          <option key={exam._id} value={exam._id}>
                              {exam.examCode}
                          </option>
                          ))}
                      </select>
                      {batchesError && <p className="error">{batchesError}</p>}
                  </div>}
              </div>
              {successMessage && <p className="success">{successMessage}</p>}
              {errorMessage && <p className="error">{errorMessage}</p>}
              {showMarksShit && <div style={{ padding: "20px 10px" }}>
              <table className="marksInputTable" border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ position: "sticky", top: "0" }}>
                    <th>Student ID</th>
                    {courses.map((course) => (
                      <th key={course.id}>{course.name} <p className="outOfMarks">(out of {course.marks})</p></th>
                    ))}
                    <th>Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark) => (
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
                            style={{ width: "100%", padding: "5px" }}
                          />
                        </td>
                      ))}
                      <td>{mark.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={handleSubmit}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Submit Marks
              </button>
              </div>}
          </Fragment>
        )}
      </div>
      
    </Fragment>
  );
}

export default ExamMarksInput;
