import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionBatchWiseAllExam.css";
import { fetchAllStudentsBatchWise } from "../../slice/studentSlice";

function PopupForShowExamResult({ content, onClose }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [students, setStudents] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    setLoading(true);

    // Fetch students batch-wise
    dispatch(fetchAllStudentsBatchWise(content.batchId))
      .unwrap()
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
  }, [dispatch, content.batchId]);

  useEffect(() => {
    if (students.length > 0) {
      const resultData = content.exam.result.filter(
        (item) => content.batchId === item.batchId.toString()
      );
      const finalResult = resultData[0]?.batchWiseResult || [];

      // Merge students with results
      const merged = students.map((student) => {
        const result = finalResult.find((res) => res.student === student.id);
        return {
          ...student,
          marks: result?.courses || [], // Include the courses or set to empty array
        };
      });

      setMergedData(merged);
    }
  }, [students, content.exam.result, content.batchId]);

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {loading && <p>Loading...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        {!loading && !errorMessage && (
          <Fragment>
            <h2>Exam Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {mergedData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.studentID}</td>
                    <td>{data.name}</td>
                    <td className="marks-column">
                        {console.log(data.marks)}
                        {data.marks.length > 0 ? (
                            
                            data.marks.map((mark) => (
                                
                            <div key={mark.courseName} className="mark-box" >
                                <span>{mark.courseName}:</span>
                                <div className="mark-value">{mark.marks}</div>
                            </div>
                            ))
                        ) : (
                            <div className="mark-box">N/A</div>
                        )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForShowExamResult;
