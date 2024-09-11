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
  const { user } = useSelector((state) => state.user);
  const { isLoading, error, batch } = useSelector((state) => state.batch); // get batch state from Redux
  const [loading, setLoading] = useState(false);

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
        navigate("/dashboard"); // Navigate after success
      })
      .catch((err) => {
        console.error("Error creating batch:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <MetaData title={`${user.name}'s Dashboard`} />
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
                  min={new Date().getFullYear()}
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

              {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Batch"}
              </button>
            </form>
            {batch && <p style={{ color: "green" }}>Batch created successfully!</p>} {/* Success message */}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default CreateBatch;
