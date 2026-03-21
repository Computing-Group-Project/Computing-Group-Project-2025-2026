import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import StudentLayout from "../layouts/StudentLayout.jsx";
import { useWallet } from "../contexts/WalletContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import PaymentGatewayModal from "../components/common/PaymentGatewayModal.jsx";

const Wallet = () => {

  const navigate = useNavigate();
  const { balance, refreshBalance } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/api/wallet/transactions");
      setTransactions(res.data.data || []);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleTopUpSuccess = () => {
    refreshBalance();
    fetchTransactions();
  };

  return (
    <StudentLayout>

      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-white bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
        >
          ← Back to Dashboard
        </button>


        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">

          <div>
            <h2 className="text-gray-500 dark:text-gray-400 text-sm uppercase">
              Current Balance
            </h2>

            <div className="flex items-baseline mt-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {Number(balance).toFixed(2)}
              </span>

              <span className="ml-2 text-xl font-semibold text-yellow-400">
                GK
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              1 GK = 10 LKR
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            + Add Funds
          </button>

        </div>


        <div className="mt-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm rounded-xl overflow-hidden">

          <div className="p-6 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm">

                <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Ref ID</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-right">Balance After</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No transactions yet
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.transactionId}>
                        <td className="p-4 text-gray-500 dark:text-gray-400">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "N/A"}
                        </td>
                        <td className="p-4 text-gray-900 dark:text-white">
                          {tx.description}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold
                            ${["CREDIT", "DEPOSIT", "REFUND"].includes(tx.type)
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-xs">
                          {tx.referenceId || "-"}
                        </td>
                        <td
                          className={`p-4 text-right font-semibold
                          ${["CREDIT", "DEPOSIT", "REFUND"].includes(tx.type) ? "text-green-400" : "text-red-400"}`}
                        >
                          {["CREDIT", "DEPOSIT", "REFUND"].includes(tx.type) ? "+" : "-"}
                          {Number(tx.amount).toFixed(2)} GK
                        </td>
                        <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                          {Number(tx.balanceAfter).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>

            </div>
          )}

        </div>


      </div>

      {createPortal(
        <PaymentGatewayModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleTopUpSuccess}
        />,
        document.body
      )}

    </StudentLayout>
  );
};

export default Wallet;
