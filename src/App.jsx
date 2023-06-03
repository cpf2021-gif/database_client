import useLocalStorage from "./hook/useLocalStorage";
import { Login } from "./page/Login";
import { Home } from "./page/Home";

function App() {
  const [user, setuser] = useLocalStorage("msg", {});

  if (user.username && user.role) {
    return <Home user={user} setuser={setuser} />;
  }

  return <Login setuser={setuser} />;
}

export default App;
