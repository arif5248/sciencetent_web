import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/metaData/metaData";
import "./batchWiseAllExam.css";
import PopupForShowExamResult from "./actionBatchWiseAllExam";
import { fetchGetSingleExamDetails } from "../../slice/examSlice";

function BatchWiseAllExam({ batchWiseAllExam , batchId}) {
    const dispatch = useDispatch()
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
    const closePopup = () => setShowPopup(false) || setPopupContent(null);
    const reversedOptions = [...batchWiseAllExam].reverse()

    const handleDetails = (exam) => {
      dispatch(fetchGetSingleExamDetails(exam._id))
            .unwrap()
            .then((response) => {
              openPopup({
                type: "details",
                batchId: batchId,
                examDetails: response.exam,
              });
            })
            .catch((err) => {
              setErrorMessage(err.message || "Failed to load data.");
            })
            .finally(() => setLoading(false));
        
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
              </tr>
            </thead>
            <tbody>
              {reversedOptions.map((exam, index) => (
                <tr key={index} className="examRow" onClick={() => handleDetails(exam)}>
                  <td>{exam.examCode}</td>
                  <td>{exam.name}</td>
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
