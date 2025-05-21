import { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import Home from "./pages/home";
import SignUp from "./pages/signup";
import Dashboard from "./pages/dashboard";
import "./index.css";
import PayementSuccessfull from "./pages/paymentSuccess";
import SignIn from "./pages/signinUser";

function App() {
  return (
    <Router>
      <Suspense fallback={<Home />}>
        <Routes>
          <Route path={ROUTES.LANDING} element={<Home />} />
          <Route path={"*"} element={<Home />} />
          <Route path={ROUTES.SIGNIN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route
            path={ROUTES.PAYMENT_SUCCESS}
            element={<PayementSuccessfull />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
