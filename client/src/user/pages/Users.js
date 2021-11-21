import React, { useEffect, useState } from "react";

import ErrorModal from "../../shared/components/UIElememnts/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElememnts/LoadingSpinner";
import UsersList from "../components/UsersList";

export default function Users() {
  const [loadedUsers, setLoadedUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/users/");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setLoadedUsers(data.users);
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    };
    sendRequest();
  }, []);

  const errorHandler = () => setError(null);

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </>
  );
}
