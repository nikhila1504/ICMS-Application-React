import "bootstrap-icons/font/bootstrap-icons.css";
import "react-datepicker/dist/react-datepicker.module.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
// import "./icms.css";
import LoginComponent from "./auth/Login";
import Registration from "./auth/Registration";
import AddPartyComponent from "./components/AddPartyComponent";
import CalendarComponent from "./components/CalendarComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import PartyListComponent from "./components/PartyListComponent";
import Wc1FormComponent from "./components/Wc1Form";
import Wc1Form from "./components/Wc1FormComponent";
import Wc1Component from "./components/Wc1Component";
import ReportPageComponent from "./components/report.page.component";

import manageMatchingClaims from "./components/manageMatchingClaims";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {
  return (
    <div>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <HeaderComponent />
          <div className="container flex-fill">
            <Routes>
              <Route exact path="/" element={<LoginComponent />} />
              <Route exact path="/login" element={<LoginComponent />} />
              <Route exact path="/register" element={<Registration />} />
              <Route path="/parties" element={<PartyListComponent />} />
              <Route path="/wc1Form" element={<Wc1Form />} />
              <Route path="/wc1" element={<Wc1FormComponent />} />
              <Route path="/add-party" element={<AddPartyComponent />} />
              <Route path="/edit-party/:id" element={<AddPartyComponent />} />
              {/* <Route path="/newWc1" element={<NewWc1 />} /> */}
              <Route path="/Wc1poc" element={<Wc1Component />} />
              <Route path="/calendar/:id" element={<CalendarComponent />} />
              <Route path="/manageMatchingClaims" element={<manageMatchingClaims />} />
              <Route path="/reports" element={<ReportPageComponent />} />
            </Routes>
          </div>
          <FooterComponent />
        </div>
      </Router>
    </div>
  );
}

export default App;
