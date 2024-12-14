import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./getResult.css";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchGetAllExamBatchWise } from "../../slice/examSlice";
import BatchWiseAllExam from "./batchWiseAllExam";

function GetResult() {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDuplicateCourse, setErrorDuplicateCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSelectBatch, setShowSelectBatch] = useState(false);
  const [showBatchWiseAllExamList, setShowBatchWiseAllExamList] = useState(false);
  const [batch, setBatch] = useState("");
  const [batchOptions, setBatchOptions] = useState([]);

  const [batchWiseAllExam, setBatchWiseAllExam] = useState([])

  const resultOptions = [
    { id : 1, name : "All Exam (Batch-wise)" },
    { id : 2, name : "Single Exam Result For All Batch" },
    { id : 3, name : "Single Exam Result For Specific Batch" },
    { id : 4, name : "Batch-wise All Exam" },
    { id : 5, name : "Batch-wise All Exam" },
    { id : 6, name : "Batch-wise All Exam" },
  ]
  const handleResultType = (resultId) => {
    setLoading(true)
    setShowSelectBatch(false)
    setBatchOptions([])
    if(resultId === "1"){
        setLoading(true)
        dispatch(fetchAllBatchForReg())
        .unwrap()
        .then((response) => {
        setBatchOptions(response.batches || []);
        })
        .catch((err) => {
        console.log(err)
        setErrorMessage("Failed to load batches. Please try again.");
        });
        setShowSelectBatch(true)
        setLoading(false)
    }
  }
  const handleBatch = (batchId) => {
    setBatch(batchId)

    setLoading(true);
        dispatch(fetchGetAllExamBatchWise(batchId))
        .unwrap()
        .then((response) => {
            // console.log(response)
            setBatchWiseAllExam(response.exams || []);
            setShowBatchWiseAllExamList(true);
        })
        .catch((err) => {
        setErrorMessage(err.message || "Failed to load data.");
        })
        .finally(() => setLoading(false));
  }

  
  return (
    <Fragment>
      <MetaData title="Create Exam" />
      <div className="getResultSection">
        {loading ? ( <Loader /> ) : (
            <Fragment>
                {/* <h2>Create Exam</h2> */}
                <div className="selectResultType">
                    <div className="form-group">
                        <select value="" onChange={(e) => handleResultType(e.target.value)}>
                            <option value="">Select Result Type</option>
                            {resultOptions.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    {showSelectBatch && (
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
                        )  
                    }
                </div>

                {showBatchWiseAllExamList && (
                    <BatchWiseAllExam batchWiseAllExam={batchWiseAllExam} batchId={batch}/>
                )}
            </Fragment>
        )}
        
      </div>
    </Fragment>
  );
}

export default GetResult;
