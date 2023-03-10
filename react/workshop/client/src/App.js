import { useEffect, useState } from 'react';

import * as userService from './services/userService';

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Search } from "./components/Search";
import './App.css';
import { UserList } from "./components/UserList";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() =>{
    // async function getUsers () {
    //   const users = await userService.getAll();
    // }

    // getUsers();

    userService.getAll()
      // Short-hand syntax
      // .then(setUsers)
      .then(users => {
        setUsers(users);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <Header />
      <main className="main">
        <section className="card users-container">
          <Search />

          <UserList users={users} />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
