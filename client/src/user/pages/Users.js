import React, { useEffect, useState } from "react";

import ErrorModal from "../../shared/components/UIElememnts/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElememnts/LoadingSpinner";
import UsersList from "../components/UsersList";
import { useHttpClient } from "./../../shared/hooks/http-hook";

export default function Users() {
  const [loadedUsers, setLoadedUsers] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sendRequest("http://localhost:5000/api/users/");
        setLoadedUsers(data.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
}
