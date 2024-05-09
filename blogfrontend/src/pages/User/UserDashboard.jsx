import React from "react";
import SideBars from "./SideBars";
import UpdateProfile from "./UserProfile";

const UserDashboard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "35%" }}>
      <div>
        <SideBars />
      </div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <UpdateProfile />
      </div>
    </div>
  );
};

export default UserDashboard;
