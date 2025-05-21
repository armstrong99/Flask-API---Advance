import * as React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes";
import { FaCheck } from "react-icons/fa";

interface IPayementSuccessfullProps {}

const PayementSuccessfull: React.FunctionComponent<
  IPayementSuccessfullProps
> = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-1xl font-bold text-center mb-4">
          <span>
            {" "}
            Payment Successful{" "}
            <FaCheck
              style={{
                color: "limegreen",
                fontSize: "40px",
                display: "inline",
              }}
            />{" "}
          </span>
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Thank you for your payment!
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PayementSuccessfull;
