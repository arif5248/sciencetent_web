import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./examMarksInput.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";

function ExamMarksInput() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [batchesError, setBatchesError] = useState(null);
  const [batchOptions, setBatchOptions] = useState([]); 

  
  const [batch, setBatch] = useState("");
  const [exam, setExam] = useState("");
  
  const [students, setStudents] = useState([
    { id: "s1", name: "John Doe" },
    { id: "s2", name: "Jane Smith" },
    { id: "s3", name: "Jane Smith" },
    { id: "s4", name: "Jane Smith" },
    { id: "s5", name: "Jane Smith" },
    { id: "s6", name: "Jane Smith" },
    { id: "s7", name: "Jane Smith" },
    { id: "s8", name: "Jane Smith" },
    { id: "s9", name: "Jane Smith" },
    { id: "s10", name: "Jane Smith" },
    { id: "s11", name: "Jane Smith" },
    { id: "s12", name: "Jane Smith" },
    { id: "s13", name: "Jane Smith" },
    { id: "s14", name: "Jane Smith" },
    { id: "s15", name: "Jane Smith" },
    { id: "s16", name: "Jane Smith" },
    { id: "s17", name: "Jane Smith" },
    { id: "s18", name: "Jane Smith" },
    { id: "s19", name: "Jane Smith" },
    { id: "s20", name: "Jane Smith" },
    { id: "s21", name: "Jane Smith" },
    { id: "s22", name: "Jane Smith" },
    { id: "s23", name: "Jane Smith" },
    { id: "s24", name: "Jane Smith" },
    { id: "s25", name: "Jane Smith" },
    { id: "s26", name: "Jane Smith" },
    { id: "s27", name: "Jane Smith" },
    { id: "s28", name: "Jane Smith" },
    { id: "s29", name: "Jane Smith" },
  ]);

  const [courses, setCourses] = useState([
    { id: "c1", name: "Math" },
    { id: "c2", name: "Physics" },
    { id: "c3", name: "Chemistry" },
    { id: "c4", name: "Biology" },
    { id: "c5", name: "ICT" },
  ]);

  const handleBatchAndExamData = () => {
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
                    <select value={batch} onChange={(e) => setBatch(e.target.value)} required>
                        <option value="">Select Batch</option>
                        {batchOptions.map((batch) => (
                        <option key={batch._id} value={batch._id}>
                            {batch.name}
                        </option>
                        ))}
                    </select>
                    {batchesError && <p className="error">{batchesError}</p>}
                </div>
                <div className="form-group animated">
                    {/* <label>Select Exam</label> */}
                    <select value={exam} onChange={(e) => setExam(e.target.value)} required>
                        <option value="">Select Exam</option>
                        {batchOptions.map((exam) => (
                        <option key={exam._id} value={exam._id}>
                            {exam.name}
                        </option>
                        ))}
                    </select>
                    {batchesError && <p className="error">{batchesError}</p>}
                </div>
                <button type="button" className="addGuardBtn" onClick={handleBatchAndExamData}>
                OK
                </button>
            </div>
             <div style={{ padding: "20px" }}>
             <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr>
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
          </div>
          </Fragment>
        )}
      </div>
      
    </Fragment>
  );
}

export default ExamMarksInput;
