import React, { Fragment, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./actionBatchWiseAllExam.css";
import printIcon from "../../images/icons/icons8-print.gif"

function PopupForShowExamResult({ content, onClose }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
  const [sliderValue, setSliderValue] = useState(60); // Slider value for percentage
  
  // Function to calculate the background color based on percentage
  const getBackgroundColor = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    let colorIntensity = 0;

    // Adjust color intensity based on percentage
    if (percentage >= sliderValue) {
      colorIntensity = Math.min(255, (percentage - sliderValue) * 2); // Increase color intensity as percentage goes up
      return `rgb(0, ${255 - colorIntensity}, 0)`; // Green gradient
    } else {
      return `rgb(255, ${255 - Math.min(255, (sliderValue - percentage) * 2)}, ${255 - Math.min(255, (sliderValue - percentage) * 2)})`; // Red gradient
    }
  };

  
  const printTable = () => {
    const tableContent = document.getElementById("printableTable").innerHTML;
    const originalContent = document.body.innerHTML;
  
    document.body.innerHTML = `
      <html>
        <head>
          <title>Print Exam Results</title>
          <style>
            th {
              background-color: #016c81 !important;
              color: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 10px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${tableContent}
        </body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Refresh to restore the original content
  };
  
  

  return (
    <div className="popup-overlay">
      <div className="result_popup popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        {console.log(content.examDetails)}
        {loading && <p>Loading...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        {!loading && !errorMessage && (
          <Fragment>
            <h2>Exam Results <button style={{border: "none"}} className="print-btn" onClick={printTable}><img style={{width: "25px"}} src={printIcon}/> </button></h2>
            {/* Slider for threshold percentage */}
            <div className="slider-container">
              <label>Threshold Percentage: {sliderValue}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                className="slider"
              />
            </div>

            <div id="printableTable">
              <table className="examResultTable" style={{ borderCollapse: "separate" }}>
                <thead>
                  <tr>
                    <th rowSpan={2}>ID</th>
                    <th rowSpan={2}>Name</th>
                    {content.examDetails.courses.map((course) => {
                      if(course.marks.cq === "00" || course.marks.mcq === "00"){
                        return(
                          <th>{course.courseName}</th>
                        )
                      }else{
                        return(
                          <th colSpan={2}>{course.courseName}</th>
                        )
                      }
                    })}
                    <th rowSpan={2}>Total Marks</th> {/* Total Marks Column */}
                  </tr>
                  <tr>
                    {content.examDetails.courses.map((course) => (
                      <>
                      {course.marks.cq !== "00" && <th style={{ fontSize: "14px" }}>
                          CQ({course.marks.cq})
                        </th>}
                        
                        {course.marks.mcq !== "00" && <th style={{ fontSize: "14px" }}>
                          MCQ({course.marks.mcq})
                        </th>}
                      </>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {content.examDetails.result
                    .find((item) => item.batchId === content.batchId)
                    .batchWiseResult.map((student) => {
                      const totalMarks = content.examDetails.courses.reduce(
                        (acc, course) => {
                          const studentCourse = student.courses.find(
                            (sc) => sc.courseId === course.course
                          );
                          const cq = studentCourse?.marks.cq || 0;
                          const mcq = studentCourse?.marks.mcq || 0;
                          return acc + parseInt(cq) + parseInt(mcq);
                        },
                        0
                      );

                      return (
                        <tr key={student.studentID}>
                          <td>{student.studentID}</td>
                          <td>{student.studentName}</td>
                          {content.examDetails.courses.map((course) => {
                            const studentCourse = student.courses.find(
                              (sc) => sc.courseId === course.course
                            );
                            const cq = studentCourse?.marks.cq !== "null" ? studentCourse?.marks.cq : 0;
                            const mcq = studentCourse?.marks.mcq !== "null" ? studentCourse?.marks.mcq : 0;

                            return (
                              <>
                                {course.marks.cq !== "00" && <td
                                  style={{
                                    backgroundColor: getBackgroundColor(
                                      parseInt(cq),
                                      course.marks.cq
                                    ),
                                  }}
                                >
                                  {cq}
                                </td>}
                                {course.marks.mcq !== "00" && <td
                                  style={{
                                    backgroundColor: getBackgroundColor(
                                      parseInt(mcq),
                                      course.marks.mcq
                                    ),
                                  }}
                                >
                                  {mcq}
                                </td>}
                              </>
                            );
                          })}
                          <td style={{
                              backgroundColor: getBackgroundColor(
                                parseInt(totalMarks),
                                content.examDetails.totalMarks
                              ),
                            }}>{totalMarks}</td> {/* Display total marks */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default PopupForShowExamResult;
