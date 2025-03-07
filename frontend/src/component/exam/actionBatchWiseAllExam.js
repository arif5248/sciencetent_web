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
  const [numberOfCourse, setNumberOfCourse] = useState();

  useEffect(() => {
    const result = content.examDetails.result
    console.log(result)
    setNumberOfCourse(content.examDetails.courses.length * 2)

  }, []);

 

  return (
    <div className="popup-overlay">
      <div className="result_popup popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {loading && <p>Loading...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        {!loading && !errorMessage && (
          <Fragment>
            <h2>Exam Results</h2>
            <table className="examResultTable" style={{borderCollapse : "separate"}}>
              <thead>
                <tr>
                  <th rowSpan={2}>ID</th>
                  <th rowSpan={2}>Name</th>
                  {
                    content.examDetails.courses.map(course =>(
                      <th colSpan={2}>{course.courseName}</th>
                    ))
                  }
                </tr>
                <tr>
                {
                    content.examDetails.courses.map(course =>(
                      <>
                        <th style={{fontSize: "14px"}} >CQ({course.marks.cq})</th>
                        <th style={{fontSize: "14px"}} >MCQ({course.marks.mcq})</th>
                      </>
                      
                    ))
                  }
                </tr>
              </thead>
              <tbody>
              {(content.examDetails.result.find(item => item.batchId === content.batchId)).batchWiseResult.map((student) => (
                <tr key={student.studentID}>
                  <td>{student.studentID}</td>
                  <td>{student.studentName}</td>
                  {content.examDetails.courses.map((course) => {
                    const studentCourse = student.courses.find(
                      (sc) => sc.courseId === course.course
                    );
                    return (
                      <>
                        <td>{studentCourse?.marks.cq !== "null" ? studentCourse?.marks.cq : "-"}</td>
                        <td>{studentCourse?.marks.mcq !== "null" ? studentCourse?.marks.mcq : "-"}</td>
                      </>
                    );
                  })}
                </tr>
              ))}
            </tbody>

              {/* <tbody>
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
              </tbody> */}
            </table>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForShowExamResult;
