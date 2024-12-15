import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layout/metaData/metaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/loader/loader";
import { useNavigate } from "react-router-dom";
import "./assignPermission.css";
import { fetchSingleUser } from "../../slice/userSlice";
import { fetchAllPermissions, fetchAssignPermissions } from "../../slice/permissionSlice";

function AssignPermission() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchUser, setSearchUser] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const { user, isLoading, singleUser } = useSelector((state) => state.user);

  // Fetch all permissions on component mount
  useEffect(() => {
    dispatch(fetchAllPermissions())
      .unwrap()
      .then((res) => {
        console.log("Fetched permissions:", res.permissions);
        setPermissionsList(res.permissions || []);
      })
      .catch((err) => console.error("Error fetching permissions:", err));
  }, [dispatch]);

  // Update userDetails and selectedPermissions when singleUser changes
  useEffect(() => {
    if (singleUser) {
      setUserDetails(singleUser);
      setSelectedPermissions(singleUser.permissions || []);
    }
  }, [singleUser]);

  // Handle Search button click
  const handleSearchUser = async () => {
    try {
      await dispatch(fetchSingleUser(searchUser)).unwrap();
    } catch (err) {
      console.error("Error fetching user details:", err);
      setErrorMessage("Error fetching user details. Please try again."); // Set error message
    }
  };

  // Handle permission checkbox change
  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permission._id)) {
        return prev.filter((p) => p !== permission._id);
      } else {
        return [...prev, permission._id];
      }
    });
  };

  // Handle Assign Permissions button click
  const handleAssignPermissions = () => {
    if (!userDetails) {
      console.error("User details are not available");
      return;
    }

    const assignData = {
      userId: userDetails._id,
      permissionIds: selectedPermissions,
    };

    // console.log(assignData);

    dispatch(fetchAssignPermissions(assignData))
      .unwrap()
      .then(() => {
        setSuccessMessage("Permissions assigned successfully!"); // Set success message
        setErrorMessage(""); // Clear error message
      })
      .catch((err) => {
        console.error("Error assigning permissions:", err);
        setErrorMessage("Error assigning permissions. Please try again."); // Set error message
        setSuccessMessage(""); // Clear success message
      });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <MetaData title={`${user.name}'s DashBoard`} />

      <div className="assignPermissionSection">
        <div className="searchGroup">
          <input 
            type="text" 
            placeholder="Enter username" 
            value={searchUser} 
            onChange={(e) => setSearchUser(e.target.value)} 
          />
          <button onClick={handleSearchUser}>Search</button>
        </div>

        {userDetails && (
          <Fragment>
            <h3>Assign Permissions to {userDetails.name}</h3>

            {permissionsList.length > 0 ? (
              <div className="permissionsList">
                {console.log(permissionsList)}
                {permissionsList.map((permission) => (
                  <div key={permission._id}>
                    <input 
                      type="checkbox"
                      id={permission._id}
                      checked={selectedPermissions.includes(permission._id)}
                      onChange={() => handlePermissionChange(permission)}
                    />
                    <label htmlFor={permission._id}>
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No permissions available</p>
            )}

            <button onClick={handleAssignPermissions}>Assign Permissions</button>

            {/* Success and Error Messages */}
            {successMessage && <div className="successMessage">{successMessage}</div>}
            {errorMessage && <div className="errorMessage">{errorMessage}</div>}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default AssignPermission;
