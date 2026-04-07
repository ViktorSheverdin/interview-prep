import { Navbar } from "./Components/Navbar/Navbar";
import { ToastContainer } from "./interviewPrepTasks/FrontendPatterns/CustomPromises/Singlton/ToastNotification/ToastContainer";

function App() {
  return (
    <div>
      <ToastContainer />
      {/* mounted once, never unmounts, no parent CSS interference */}
      <Navbar />;
    </div>
  );
}

export default App;
