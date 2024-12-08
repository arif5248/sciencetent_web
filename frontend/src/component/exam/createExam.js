import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchAllCoursesForReg } from "../../slice/courseSlice";
import "./createExam.css";
import { FaTrash } from "react-icons/fa";
import { fetchCreateExam } from "../../slice/examSlice";

function CreateExam() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  // const {  batchesLoading, batchesError } = useSelector((state) => state.batch);
  // const {  coursesLoading, coursesError } = useSelector((state) => state.course);

  const [examName, setExamName] = useState("");
  const [examCode, setExamCode] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  let [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [guards, setGuards] = useState([{ name: "", mobile: "", center: "" }]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDuplicateCourse, setErrorDuplicateCourse] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [coursesError, setCoursesError] = useState(null);
  const [batchesError, setBatchesError] = useState(null);

  const [courseOptions, setCourseOptions] = useState([]); 
  const [batchOptions, setBatchOptions] = useState([]); 

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

    dispatch(fetchAllCoursesForReg())
      .then((response) => {
        if (response.error) {
          setCoursesError("Failed to load courses. Please try again.");
        } else {
          setCourseOptions(response.payload.courses);
          setCoursesError(null);
        }
      })
      .catch(() => setCoursesError("Failed to load courses. Please try again."));
  }, [dispatch]);
   
  useEffect(() => {
    if (errorDuplicateCourse) {
      setTimeout(() => {
        setErrorDuplicateCourse(null);
      }, 5000); // Hide error message after 3 seconds
    }
  }, [errorDuplicateCourse]);
  
  
  // Adding a new course
  const addCourse = () => {
    setSelectedCourses([
      ...selectedCourses,
      { course: "", courseName: "", courseCode: "", marks: "" },
    ]);
  };

  // Updating a course when selected
  const handleCourseChange = (index, courseId) => {
    const selectedCourse = courseOptions.find((course) => course._id === courseId);
    if (!selectedCourse) return;

    // Check for duplicate courses
    const isDuplicate = selectedCourses.some((course) => course.course === courseId);
    if (isDuplicate) {
      setErrorDuplicateCourse("This course has already been added.");
      return;
    }

    const updatedCourses = [...selectedCourses];
    updatedCourses[index] = {
      course: selectedCourse._id,
      courseName: selectedCourse.name,
      courseCode: selectedCourse.courseCode,
      marks: updatedCourses[index].marks, // Preserve existing marks if already entered
    };
    setSelectedCourses(updatedCourses);
  };


  const removeCourse = (index) => {
    setSelectedCourses(selectedCourses.filter((_, i) => i !== index));
  };

  const addGuard = () => {
    setGuards([...guards, { name: "", mobile: "", center: "" }]);
  };

  const removeGuard = (index) => {
    setGuards(guards.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const totalCourseMarks = selectedCourses.reduce((acc, cur) => acc + Number(cur.marks), 0);
    if (totalCourseMarks !== Number(totalMarks)) {
      setErrorMessage("Total marks of courses must equal exam's total marks!");
      setLoading(false);
      return;
    }

    const myForm = new FormData();

    myForm.append("name", examName);
    myForm.append("examCode", examCode);
    myForm.append("date", examDate);
    myForm.append("time", examTime);
    myForm.append("totalMarks", totalMarks);
    myForm.append("courses", JSON.stringify(selectedCourses));
    myForm.append("batches", JSON.stringify(selectedBatches));
    myForm.append("guards", JSON.stringify(guards));

    dispatch(fetchCreateExam(myForm))
      .unwrap()
      .then(() => {
        setSuccessMessage("Exam created successfully!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 20000);
      })
      .catch((err) => {
        setErrorMessage(err);
        setTimeout(() => {
          setErrorMessage(null);
        }, 20000);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Fragment>
      <MetaData title="Create Exam" />
      <div className="createExamSection">
        <h2>Create Exam</h2>
        {loading  ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit} className="examForm">
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            
            {/* Exam name */}
            <div className="formGroup">
              <label>Exam Name</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="e.g. Weekly/Monthly"
                required
              />
            </div>

            {/* exam code */}
            <div className="formGroup">
              <label>Exam Code</label>
              <input
                type="text"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                placeholder="e.g. weekly101/monthly101"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="formGroup">
              <label>Date</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} required />
            </div>
            <div className="formGroup">
              <label>Time</label>
              <input type="time" value={examTime} onChange={(e) => setExamTime(e.target.value)} required />
            </div>

            {/* Total Marks */}
            <div className="formGroup">
              <label>Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                placeholder="e.g. 100"
                required
              />
            </div>

            {/* Courses */}
            <div className="formGroup">
              <label>Courses</label>
              {selectedCourses.map((course, index) => (
                <div key={index} className="courseGroup">
                  <select
                    value={course.course}
                    onChange={(e) => handleCourseChange(index, e.target.value)}
                    required
                  >
                    <option value="">Select Course</option>
                    {courseOptions.length > 0 ? (
                      courseOptions.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <option>Loading courses...</option>
                    )}
                  </select>

                  <input
                    type="number"
                    value={course.marks}
                    onChange={(e) => {
                      const updatedCourses = [...selectedCourses];
                      
                      updatedCourses[index].marks = e.target.value;
                      setSelectedCourses(updatedCourses);
                    }}
                    placeholder="Marks"
                    required
                  />
                  <button type="button" onClick={() => removeCourse(index)}>
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button className="addCourseBtn" type="button" onClick={addCourse}>
                Add Course
              </button>
              {coursesError && (<p className="error">{coursesError}</p>) }
              {errorDuplicateCourse && <p className="error">{errorDuplicateCourse}</p>}

            </div>

            {/* Batches */}
            <div className="formGroup">
              <label>Batches</label>
              <div className="checkboxGroup">
                {batchOptions.map((batch) => (
                  <div key={batch._id} className="checkboxItem">
                    <input
                      type="checkbox"
                      id={`batch-${batch._id}`}
                      value={batch._id}
                      checked={selectedBatches.some((b) => b._id === batch._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Add selected batch with details
                          setSelectedBatches((prev) => [
                            ...prev,
                            {
                              _id: batch._id,
                              branch: batch.branch,
                              name: batch.name,
                              batchCode: batch.batchCode,
                            },
                          ]);
                        } else {
                          // Remove unselected batch
                          setSelectedBatches((prev) =>
                            prev.filter((b) => b._id !== batch._id)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`batch-${batch._id}`}>{batch.name}</label>
                  </div>
                ))}
              </div>
              {batchesError && <p className="error">{batchesError}</p>}
            </div>



            {/* Guards */}
            <div className="formGroup">
            <label>Guards</label>
            {guards.map((guard, index) => (
              <div key={index} className="guardGroup">
                <input
                  type="text"
                  placeholder="Name"
                  value={guard.name}
                  onChange={(e) => {
                    const updatedGuards = [...guards];
                    updatedGuards[index].name = e.target.value;
                    setGuards(updatedGuards);
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  value={guard.mobile}
                  onChange={(e) => {
                    const updatedGuards = [...guards];
                    updatedGuards[index].mobile = e.target.value;
                    setGuards(updatedGuards);
                  }}
                  required
                />
                <input
                  type="text"
                  placeholder="Exam Center"
                  value={guard.center}
                  onChange={(e) => {
                    const updatedGuards = [...guards];
                    updatedGuards[index].center = e.target.value;
                    setGuards(updatedGuards);
                  }}
                  required
                />
                <button
                  type="button"
                  className="removeGuardBtn"
                  onClick={() => removeGuard(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button type="button" className="addGuardBtn" onClick={addGuard}>
              Add Guard
            </button>
          </div>


            <button type="submit" className="btnSubmit" disabled={loading}>
              {loading ? "Creating..." : "Create Exam"}
            </button>
          </form>
        )}
        {/* {showSmsPopup && <SendSms msgData={msgData} onClose={closeSmsPopup} />} */}
      </div>
    </Fragment>
  );
}

export default CreateExam;
