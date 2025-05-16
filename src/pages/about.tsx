import { useEffect, useState } from "react";

const AboutPage = () => {
  const [users, setUsers] = useState<any[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await response.json();
      setUsers(users);
    };
    fetchUsers();
  }, []);
  return (
    <div>
      <div className="p-2">Hello from About!</div>
      <h1>Users</h1>

      {users &&
        users.map((user) => (
          <div className="grid grid-cols-4 p-1">
            <div className="mr-3 font-semibold">Username: </div>
            <div>{user.username}</div>
            <div className="mr-3 font-semibold">Email: </div>
            <div>{user.username}</div>
          </div>
        ))}
    </div>
  );
};

export default AboutPage;
