import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./actionBatchWiseAllExam.css";
import { fetchAllStudentsBatchWise } from "../../slice/studentSlice";

function PopupForShowExamResult({ content, onClose }) {
    const [loading, setLoading] = useState(false); 
    const dispatch = useDispatch(); 
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [students, setStudents] = useState([]);
  
    useEffect(() => {
        setLoading(true)
        dispatch(fetchAllStudentsBatchWise(content.batchId))
        .unwrap()
        .then((response) => {
            const studentData = response.students.map((student) => ({
                id: student._id,
                name: student.name,
                studentID: student.studentID,
            }));
            setStudents(studentData);
        })
        .catch((err) => {
            setErrorMessage(err.message || "Failed to load data.");
        })
        .finally(() => setLoading(false));


        const resultData = content.exam.result.filter((item) => content.batchId === item.batchId.toString());
        const finalResult = resultData[0].batchWiseResult

        // const data = [
        //     {
        //         batchId: "1",
        //         result: [
        //             {
        //                 student: "7698686878768",
        //                 courses: [
        //                     {courseId: "768968687", marks: "1"},
        //                     {courseId: "768968687", marks: "1"},
        //                 ]
        //             },{
        //                 student: "7698686878768",
        //                 courses: [
        //                     {courseId: "768968687", marks: "1"},
        //                     {courseId: "768968687", marks: "1"},
        //                 ]
        //             }
        //         ]
        //     },
        //     {
        //         batchId: "2",
        //         result: [
        //             {
        //                 student: "7698686878768",
        //                 courses: [
        //                     {courseId: "768968687", marks: "1"},
        //                     {courseId: "768968687", marks: "1"},
        //                 ]
        //             },{
        //                 student: "7698686878768",
        //                 courses: [
        //                     {courseId: "768968687", marks: "1"},
        //                     {courseId: "768968687", marks: "1"},
        //                 ]
        //             }
        //         ]
        //     }
        // ]
        // const temp = data.filter((item)=>item.batchId=== "2")
        // console.log("temp", temp)
        console.log(finalResult)
      }, [dispatch]);
  

 

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {content.type === "details" && (
          <Fragment>
            
             
          </Fragment>
        )}

        
      </div>
    </div>
  );
}

export default PopupForShowExamResult;
