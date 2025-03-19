import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./getResult.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchGetAllExamOptionsBatchWise, fetchGetSingleExamDetails } from "../../slice/examSlice";
import BatchWiseAllExam from "./batchWiseAllExam";
import PopupForModifyExam from "./popupForModifyExam";

function ModifyExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [popupContent, setPopupContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const openPopup = (content) => setShowPopup(true) || setPopupContent(content);
  const closePopup = () => setShowPopup(false) || setPopupContent(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDuplicateCourse, setErrorDuplicateCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSelectBatch, setShowSelectBatch] = useState(false);
  const [showBatchWiseAllExamList, setShowBatchWiseAllExamList] = useState(false);
  const [batch, setBatch] = useState("");
  const [resultType, setResultType] = useState("");
  const [batchOptions, setBatchOptions] = useState([]);

  const [batchWiseAllExam, setBatchWiseAllExam] = useState([])

  
  useEffect(() => {
      setLoading(true)
      // Fetch batches on component mount
      dispatch(fetchAllBatchForReg())
        .unwrap()
        .then((response) => {
            setBatchOptions(response.batches || []);
        })
        .catch((err) => {
          setErrorMessage(err || "Failed to load batches. Please try again.");
          setTimeout(() => {
            setErrorMessage(null);
          }, 20000);
          setLoading(false)
        })
        .finally(()=> setLoading(false))
        console.log(true + false)
    }, [dispatch]);

  const handleBatch = (batchId) => {
    setErrorMessage(null)
    setBatch(batchId)
    setBatchWiseAllExam([])
    setLoading(true);
        dispatch(fetchGetAllExamOptionsBatchWise(batchId))
        .unwrap()
        .then((response) => {
            
            setBatchWiseAllExam(...[response.exams].reverse() || []);
            setShowBatchWiseAllExamList(true);
        })
        .catch((err) => {
        setErrorMessage(err || "Failed to load data.");
        })
        .finally(() => setLoading(false));
  }

  const handleDetails = (exam) => {
        setLoading(true)
        dispatch(fetchGetSingleExamDetails(exam._id))
              .unwrap()
              .then((response) => {
                openPopup({
                  type: "details",
                  batchId: batch,
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
      <MetaData title="Create Exam" />
      <div className="getResultSection">
        {loading ? ( <Loader /> ) : (
            <Fragment>
                {/* <h2>Create Exam</h2> */}
                <div className="selectBatch">
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
                </div>
                {errorMessage ? (
                    <p className="noExamFound">{errorMessage}</p>
                ) : (
                    showBatchWiseAllExamList && (
                        <Fragment>
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
                                    {batchWiseAllExam.map((exam, index) => (
                                        <tr key={index} className="examRow" onClick={() => handleDetails(exam)}>
                                        <td>{exam.examCode}</td>
                                        <td>{exam.name}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </Fragment>
                    )
                )}
            {showPopup && <PopupForModifyExam content={popupContent} onClose={closePopup} />}
            </Fragment>
        )}
        
      </div>
    </Fragment>
  );
}

export default ModifyExam;
