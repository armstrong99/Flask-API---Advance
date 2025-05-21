import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import { addusers } from "../redux/reducers/user";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Transaction {
  id: number;
  amount: number;
  date: string;
  status: "PAID" | "PENDING" | "FAILED";
}

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // State for funding modal
  const [isFundingModalOpen, setIsFundingModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const pingService = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      dispatch(addusers(data.user));
    } catch (error) {
      console.error("Error pinging service:", error);
      navigate("/sign-in");
    }
  };

  const generateFundUrl = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "http://localhost:5001/api/transactions/initialize-payment",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: fundAmount,
            customer_email: user.email,
            customer_name: user.full_name,
            reference: `ref-${Date.now()}`,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate payment URL");
      const data = await response.json();

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      setError(
        (err as Error).message ||
          "An error occurred while processing your request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundWallet = () => setIsFundingModalOpen(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAmount || isNaN(Number(fundAmount))) {
      setError("Please enter a valid amount");
      return;
    }
    generateFundUrl();
  };

  useEffect(() => {
    if (!user.id) pingService();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 overflow-x-hidden">
      {/* Funding Modal */}
      <Transition appear show={isFundingModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsFundingModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Fund Your Wallet
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="mb-4">
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Amount (₦)
                      </label>
                      <input
                        type="number"
                        id="amount"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="Enter amount"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        min="100"
                        step="100"
                        required
                      />
                    </div>

                    {error && (
                      <div className="mb-4 text-sm text-red-600">{error}</div>
                    )}

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 disabled:opacity-50"
                        onClick={() => setIsFundingModalOpen(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Proceed to Payment"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Welcome back, {user.full_name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Here's your financial overview
            </p>
          </div>
          <div className="mt-3 md:mt-0 bg-white p-3 md:p-4 rounded-xl shadow-sm w-full md:w-auto">
            <p className="text-gray-500 text-xs md:text-sm">Account Number</p>
            <p className="font-mono text-gray-800 font-medium text-sm md:text-base">
              {"01938374839"}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="mb-6 md:mb-8">
          <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {/* Balance Card */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border-l-4 border-blue-500 min-w-[280px] md:min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base md:text-lg font-medium text-gray-500">
                    Wallet Balance
                  </h2>
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                    ₦
                    {user.wallet_balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 md:h-6 w-5 md:w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
                Last updated just now
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border-l-4 border-green-500 min-w-[280px] md:min-w-0">
              <h2 className="text-base md:text-lg font-medium text-gray-500">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
                <button
                  onClick={handleFundWallet}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 md:px-4 md:py-3 rounded-lg transition flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 md:h-5 w-4 md:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Fund</span>
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 md:px-4 md:py-3 rounded-lg transition flex items-center justify-center space-x-2 text-sm md:text-base">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 md:h-5 w-4 md:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  <span>Transfer</span>
                </button>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border-l-4 border-purple-500 min-w-[280px] md:min-w-0">
              <h2 className="text-base md:text-lg font-medium text-gray-500">
                This Month
              </h2>
              <div className="flex justify-between mt-3 md:mt-4">
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Income</p>
                  <p className="text-lg md:text-xl font-bold text-green-600">
                    {"₦00.00"}
                  </p>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Expenses</p>
                  <p className="text-lg md:text-xl font-bold text-red-600">
                    {"₦00.00"}
                  </p>
                </div>
              </div>
              <div className="mt-3 md:mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  70% of monthly budget
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              Recent Transactions
            </h2>
            <button className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {new Date(txn.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs md:text-sm text-gray-900">
                        {txn.status === "PAID"
                          ? "Payment Received"
                          : txn.status === "PENDING"
                          ? "Pending Transfer"
                          : "Failed Transaction"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div
                        className={`text-xs md:text-sm font-medium ${
                          txn.status === "PAID"
                            ? "text-green-600"
                            : "text-gray-900"
                        }`}
                      >
                        ₦{txn.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                          txn.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : txn.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 md:mt-6 flex flex-col-reverse md:flex-row justify-between items-center">
            <p className="text-xs md:text-sm text-gray-500 mt-2 md:mt-0">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{transactions.length}</span> of{" "}
              <span className="font-medium">{transactions.length}</span> results
            </p>
            <div className="flex space-x-2">
              <button className="px-2 py-1 md:px-3 md:py-1 border rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-2 py-1 md:px-3 md:py-1 border rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
