import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./createBatch.css";
import { fetchCreateBatch } from "../../slice/batchSlice";

function CreateBatch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [batchName, setBatchName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [batchCode, setBatchCode] = useState("");
  const { isLoading, error, batch } = useSelector((state) => state.batch); // get batch state from Redux
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Local state for error message
  const [successMessage, setSuccessMessage] = useState(null); // Local state for success message
  // Automatically generate branch code based on selected branch and year
  useEffect(() => {
    if (branchName && year) {
      const branchInitial = branchName === "Cuet Branch" ? "CB" : "NB";
      const yearCode = year.toString().slice(-2); // Get last two digits of the year
      setBatchCode(`${branchInitial}${yearCode}`);
    }
  }, [branchName, year]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const myForm = new FormData();
    myForm.set("name", batchName);
    myForm.set("branch", branchName);
    myForm.set("finalYear", year);
    myForm.set("batchCode", batchCode);

    dispatch(fetchCreateBatch(myForm))
      .unwrap()
      .then(() => {
        setSuccessMessage("Batch created successfully!"); // Show success message
        setTimeout(() => {
          setSuccessMessage(null); // Clear success message after 5 seconds
          navigate("/dashboard"); // Navigate after success
        }, 5000);
      })
      .catch((err) => {
        console.error("Error creating course:", err);
        setErrorMessage(err); // Show error message
        setTimeout(() => {
          setErrorMessage(null); // Clear error message after 5 seconds
        }, 5000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <MetaData title={`Create Batch`} />
      <div className="createBatchSection">
        <h2>Create Batch</h2>

        {isLoading || loading ? (
          <Loader />
        ) : (
          <Fragment>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="batchName">Batch Name</label>
                <input
                  type="text"
                  id="batchName"
                  className="form-control"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="branchName">Branch Name</label>
                <select
                  id="branchName"
                  className="form-control"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  required
                >
                  <option value="">Select Branch</option>
                  <option value="Cuet Branch">Cuet Branch</option>
                  <option value="Noapara Branch">Noapara Branch</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Final Year</label>
                <input
                  type="number"
                  id="year"
                  className="form-control"
                  // min={new Date().getFullYear()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="branchCode">Branch Code</label>
                <input
                  type="text"
                  id="branchCode"
                  className="form-control"
                  value={batchCode}
                  readOnly
                />
              </div>

              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error */}
              {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} {/* Display success */}

              <button style={{marginTop: "5px"}} type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Batch"}
              </button>
            </form>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default CreateBatch;
