import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const userAccount = JSON.parse(
      localStorage.getItem("userAccount") as string
    );

    if (userAccount && userAccount["email"]) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.SIGNIN);
    }
  }, []);
  return (
    <>
      <p>Home</p>
    </>
  );
};

export default Home;
