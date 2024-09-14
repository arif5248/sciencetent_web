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
  const [searchUser, setSearchUser] = useState(""); // For input field
  const [selectedPermissions, setSelectedPermissions] = useState([]); // For storing selected permissions
  const [permissionsList, setPermissionsList] = useState([]); // Store fetched permissions
  const [userDetails, setUserDetails] = useState(null); // Store fetched user details
  const { user, isLoading } = useSelector((state) => state.user);

  // Fetch all permissions on component mount
  useEffect(() => {
    dispatch(fetchAllPermissions())
      .unwrap()
      .then((res) => {
        console.log("Fetched permissions:", res.permissions); // Check if permissions are fetched
        setPermissionsList(res.permissions || []); // Set permissions list
      })
      .catch((err) => console.error("Error fetching permissions:", err));
  }, [dispatch]);

  // Handle Search button click
  const handleSearchUser = () => {
    dispatch(fetchSingleUser(searchUser))
      .unwrap()
      .then((res) => {
        console.log("Fetched user details:", res.user); // Check if user is fetched
        setUserDetails(res.user);

        // Check the user's current permissions and update selectedPermissions state
        const userPermissionIds = res.user.permissions.map((p) => p); // Store the whole permission object
        setSelectedPermissions(userPermissionIds);
        console.log("User's permission IDs:", userPermissionIds);
      })
      .catch((err) => console.error("Error fetching user details:", err));
  };

  // Handle permission checkbox change
  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prev) => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission) 
        : [...prev, permission]
    );
  };

  // Handle Assign Permissions button click
  const handleAssignPermissions = () => {
    const assignData = {
      userId: userDetails._id,
      permissions: selectedPermissions.map(p => p._id || p), // Include permission object or ID
    };
    dispatch(fetchAssignPermissions(assignData))
      .unwrap()
      .then(() => alert("Permissions assigned successfully!"))
      .catch((err) => console.error("Error assigning permissions:", err));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <MetaData title={`${user.name}'s DashBoard`} />

      <div className="assignPermissionSection">
        {/* Search User */}
        <div className="searchGroup">
          <input 
            type="text" 
            placeholder="Enter username" 
            value={searchUser} 
            onChange={(e) => setSearchUser(e.target.value)} 
          />
          <button onClick={handleSearchUser}>Search</button>
        </div>

        {/* Show permissions list if user details are fetched */}
        {userDetails && (
          <Fragment>
            <h3>Assign Permissions to {userDetails.name}</h3>
            
            {permissionsList.length > 0 ? (
              <div className="permissionsList">
                {permissionsList.map((permission) => (
                  <div key={permission._id}>
                    <input 
                      type="checkbox"
                      id={permission._id}
                      checked={selectedPermissions.some(p => p._id === permission._id || p === permission)} // Compare the whole permission or by _id
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

            {/* Button to Assign Permissions */}
            <button onClick={handleAssignPermissions}>Assign Permissions</button>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

export default AssignPermission;
