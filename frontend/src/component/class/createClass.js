import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBatchForReg } from "../../slice/batchSlice";
import { fetchAllCoursesForReg } from "../../slice/courseSlice";
import "./createClass.css";
import { fetchCreateClass } from "../../slice/classSlice";

function CreateClass() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [startingTime, setStartingTime] = useState("");
  const [finishingTime, setFinishingTime] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [classDuration, setClassDuration] = useState("");

  const [courseOptions, setCourseOptions] = useState([]); 
  const [batchOptions, setBatchOptions] = useState([]); 

  const [coursesError, setCoursesError] = useState(null);
  const [batchesError, setBatchesError] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
    if (startingTime && finishingTime) {
      const start = new Date(`2023-01-01T${startingTime}`);
      const finish = new Date(`2023-01-01T${finishingTime}`);
      const duration = (finish - start) / (1000 * 60 * 60);
      setClassDuration(duration);
    }
  }, [startingTime, finishingTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const convertTo12HourFormat = (time) => {
      const [hours, minutes] = time.split(":");
      let hours12 = parseInt(hours, 10);
      const period = hours12 >= 12 ? "pm" : "am";
      hours12 = hours12 % 12 || 12; // Convert to 12-hour format, handling 12 as a special case
      return `${hours12}:${minutes}${period}`;
    };

    const convertedStartingTime = convertTo12HourFormat(startingTime);
    const convertedFinishingTime = convertTo12HourFormat(finishingTime);
    
    const selectedCourse = courseOptions.find(c => c._id === course)
    const courseDetails = {
      courseId: selectedCourse._id,
      courseCode: selectedCourse.courseCode,
      courseName: selectedCourse.name
    }

    const myForm = new FormData();

    myForm.append("batch", batch);
    myForm.append("course", courseDetails);
    myForm.append("date", date);
    myForm.append("startingTime", convertedStartingTime);
    myForm.append("finishingTime", convertedFinishingTime);
    myForm.append("teacherName", teacherName);
    myForm.append("classDuration", classDuration);

    const classData = { batch, course, date, startingTime, finishingTime, teacherName, classDuration };
    console.log(classData);

    dispatch(fetchCreateClass(myForm))
      .unwrap()
      .then(() => {
        setSuccessMessage("Class created successfully!");
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
    <div className="createClassSection">
      <h2>Create Class</h2>
      <form onSubmit={handleSubmit} className="createClassForm">
        <div className="formGroup">
          <label>Batch</label>
          <select value={batch} onChange={(e) => setBatch(e.target.value)} required>
            <option value="">Select Batch</option>
            {batchOptions?.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          {batchesError && <p className="error">{batchesError}</p>}
        </div>

        <div className="formGroup">
          <label>Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courseOptions?.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {coursesError && <p className="error">{coursesError}</p>}
        </div>

        <div className="formGroup">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label>Starting Time</label>
          <input type="time" value={startingTime} onChange={(e) => setStartingTime(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label>Finishing Time</label>
          <input type="time" value={finishingTime} onChange={(e) => setFinishingTime(e.target.value)} required />
        </div>

        <div className="formGroup">
          <label>Teacher</label>
          <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="Enter Teacher Name" required />
        </div>

        <div className="formGroup">
          <label>Class Duration (Hours)</label>
          <input type="Number" value={classDuration} readOnly />
        </div>

        {successMessage && <p className="success">{successMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="btnSubmit" disabled={loading}>
            {loading ? "Creating..." : "Create Class"}
        </button>
      </form>
    </div>
  );
}

export default CreateClass;
