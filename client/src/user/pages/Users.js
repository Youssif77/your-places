import React from "react";
import UsersList from "../components/UsersList";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Youssif Hany",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    places: 2,
  },
  {
    id: "u2",
    name: "Jack Dorsi",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    places: 1,
  },
  {
    id: "u3",
    name: "Rose Michel",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    places: 3,
  },
];

export default function Users() {
  return <UsersList items={DUMMY_USERS} />;
}
