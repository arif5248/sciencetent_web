import React, { Fragment, useState } from "react";
import MetaData from "../layout/metaData/metaData";
import "./batchWiseAllExam.css";
import PopupForShowExamResult from "./actionBatchWiseAllExam";

function BatchWiseAllExam({ batchWiseAllExam , batchId}) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
    const closePopup = () => setShowPopup(false) || setPopupContent(null);

    const handleDetails = (exam) => {
        openPopup({
          type: "details",
          batchId: batchId,
          exam,
        });
      };

  return (
    <Fragment>
      <MetaData title="Batch-wise All Exam" />
      <div className="batchWiseAllExamSection">
        <h2 className="examListTitle">Batch-wise Exam List</h2>
        <div className="examTableContainer">
          <table className="examTable">
            <thead>
              <tr>
                <th>Exam Code</th>
                <th>Name</th>
                <th>Courses</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {batchWiseAllExam.map((exam, index) => (
                <tr key={index} className="examRow" onClick={() => handleDetails(exam)}>
                  <td>{exam.examCode}</td>
                  <td>{exam.name}</td>
                  <td>
                    {exam.courses.map((course, i) => (
                      <span key={i} className="courseTag">
                        {course.courseName}
                      </span>
                    ))}
                  </td>
                  <td>{exam.totalMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showPopup && <PopupForShowExamResult content={popupContent} onClose={closePopup} />}
    </Fragment>
  );
}

export default BatchWiseAllExam;
