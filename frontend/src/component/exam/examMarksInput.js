import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./examMarksInput.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchGetAllExamBatchWise } from "../../slice/examSlice";
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
  
  const [batch, setBatch] = useState("");
  const [exam, setExam] = useState("");
  
  // const [students, setStudents] = useState([
  //   { id: "s1", name: "John Doe" },
  //   { id: "s2", name: "Jane Smith" },
  //   { id: "s3", name: "Jane Smith" },
  //   { id: "s4", name: "Jane Smith" },
  //   { id: "s5", name: "Jane Smith" },
  //   { id: "s6", name: "Jane Smith" },
  //   { id: "s7", name: "Jane Smith" },
  //   { id: "s8", name: "Jane Smith" },
  //   { id: "s9", name: "Jane Smith" },
  //   { id: "s10", name: "Jane Smith" },
  //   { id: "s11", name: "Jane Smith" },
  //   { id: "s12", name: "Jane Smith" },
  //   { id: "s13", name: "Jane Smith" },
  //   { id: "s14", name: "Jane Smith" },
  //   { id: "s15", name: "Jane Smith" },
  //   { id: "s16", name: "Jane Smith" },
  //   { id: "s17", name: "Jane Smith" },
  //   { id: "s18", name: "Jane Smith" },
  //   { id: "s19", name: "Jane Smith" },
  //   { id: "s20", name: "Jane Smith" },
  //   { id: "s21", name: "Jane Smith" },
  //   { id: "s22", name: "Jane Smith" },
  //   { id: "s23", name: "Jane Smith" },
  //   { id: "s24", name: "Jane Smith" },
  //   { id: "s25", name: "Jane Smith" },
  //   { id: "s26", name: "Jane Smith" },
  //   { id: "s27", name: "Jane Smith" },
  //   { id: "s28", name: "Jane Smith" },
  //   { id: "s29", name: "Jane Smith" },
  // ]);

 

  const handleBatch = (batchId) => {
    setLoading(true);
    setBatch(batchId);
    setShowExamSelectBox(false);
  
    dispatch(fetchGetAllExamBatchWise(batchId))
      .unwrap()
      .then((response) => {
        setSuccessMessage("All Exams fetched successfully!");
        console.log(response)
        setExamOptions(response.exams);
  
        if (response.success === true) {
          setShowExamSelectBox(true);
        }
  
        // Call the second API
        return dispatch(fetchAllStudentsBatchWise(batchId)).unwrap();
      })
      .then((studentResponse) => {
        setSuccessMessage("All Students fetched successfully!");
        setStudents(studentResponse.students); // Assuming you want to store students in state
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
    console.log(examOptions)
    const selectedExam = examOptions.find((exam) => exam._id === examId);
    console.log(selectedExam);
  
    // Use a temporary array to accumulate the updated courses
    const updatedCourses = selectedExam.courses.map((course) => ({
      id: course._id,
      name: course.courseName,
      mark: course.marks,
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

    // dispatch(fetchAllCoursesForReg())
    //   .then((response) => {
    //     if (response.error) {
    //       setCoursesError("Failed to load courses. Please try again.");
    //     } else {
    //       setCourseOptions(response.payload.courses);
    //       setCoursesError(null);
    //     }
    //   })
    //   .catch(() => setCoursesError("Failed to load courses. Please try again."));
  }, [dispatch]);

  // State to hold marks
  const [marks, setMarks] = useState(
    students.map((student) => ({
      studentId: student.id,
      studentName: student.name,
      courseMarks: courses.reduce((acc, course) => {
        acc[course.id] = "";
        return acc;
      }, {}),
      total: 0,
    }))
  );

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
    console.log("Marks Submitted: ", marks);
    // Replace with API call
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
              <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ position: "sticky", top: "0" }}>
                    <th>Student Name</th>
                    {courses.map((course) => (
                      <th key={course.id}>{course.name}</th>
                    ))}
                    <th>Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark) => (
                    <tr key={mark.studentId}>
                      <td>{mark.studentName}</td>
                      {courses.map((course) => (
                        <td key={course.id}>
                          <input
                          className="numberInput"
                            type="number"
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
