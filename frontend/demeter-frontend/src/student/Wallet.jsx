import React, { useState } from "react";
import StudentLayout from "../layouts/StudentLayout.jsx";
import { useWallet } from "../context/WalletContext.jsx";
import { useNavigate } from "react-router-dom";

const Wallet = () => {

  const navigate = useNavigate();
  const { balance, addFunds } = useWallet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState("");

  const [transactions, setTransactions] = useState([
    {
      transaction_id: 101,
      transaction_type: "ORDER_PAYMENT",
      amount: -450,
      balance_before: 1950,
      balance_after: 1500,
      reference_id: "ORD-2024-001",
      description: "Payment for Order #ORD-2024-001 at Hexcore Café",
      created_at: "2024-03-10 12:30:00"
    },
    {
      transaction_id: 100,
      transaction_type: "TOP_UP",
      amount: 1000,
      balance_before: 950,
      balance_after: 1950,
      reference_id: "PAY-8821",
      description: "Wallet top-up via Admin Console",
      created_at: "2024-03-09 09:15:00"
    }
  ]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAmountToAdd("");
  };

  const handleAddFunds = (e) => {
    e.preventDefault();

    const amount = parseFloat(amountToAdd);

    if (!amount || amount <= 0) return;

    const newBalance = balance + amount;

    addFunds(amount);

    const newTransaction = {
      transaction_id: transactions.length + 200,
      transaction_type: "TOP_UP",
      amount: amount,
      balance_before: balance,
      balance_after: newBalance,
      reference_id: `PAY-${Math.floor(Math.random() * 10000)}`,
      description: "User initiated top-up",
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19)
    };

    setTransactions(prev => [newTransaction, ...prev]);

    handleCloseModal();
  };

  return (
    <StudentLayout>

      <div className="w-screen relative left-1/2 -translate-x-1/2 px-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 rounded-lg border border-slate-700 text-white bg-slate-800 hover:bg-slate-700"
        >
          ← Back to Dashboard
        </button>


        {/* BALANCE CARD */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex justify-between items-center">

          <div>
            <h2 className="text-gray-400 text-sm uppercase">
              Current Balance
            </h2>

            <div className="flex items-baseline mt-2">
              <span className="text-4xl font-bold text-white">
                {balance.toFixed(2)}
              </span>

              <span className="ml-2 text-xl font-semibold text-yellow-400">
                GK
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              1 GK = 1 LKR
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            + Add Funds
          </button>

        </div>


        {/* TRANSACTION TABLE */}
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">

          <div className="p-6 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">
              Transaction History
            </h3>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-700 text-gray-300 uppercase text-xs">

                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Ref ID</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">Balance After</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-slate-700">

                {transactions.map((tx) => (

                  <tr key={tx.transaction_id}>

                    <td className="p-4 text-gray-400">
                      {tx.created_at}
                    </td>

                    <td className="p-4 text-white">
                      {tx.description}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold
                        ${
                          tx.transaction_type === "TOP_UP"
                            ? "bg-green-900 text-green-300"
                            : tx.transaction_type === "REFUND"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {tx.transaction_type}
                      </span>

                    </td>

                    <td className="p-4 text-gray-400 font-mono text-xs">
                      {tx.reference_id}
                    </td>

                    <td
                      className={`p-4 text-right font-semibold
                      ${
                        tx.amount > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toFixed(2)} GK
                    </td>

                    <td className="p-4 text-right text-gray-300">
                      {tx.balance_after.toFixed(2)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>


        {/* ADD FUNDS MODAL */}
        {isModalOpen && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6">

              <h3 className="text-xl font-bold text-white mb-6">
                Add Funds
              </h3>

              <form onSubmit={handleAddFunds}>

                <input
                  type="number"
                  min="1"
                  required
                  value={amountToAdd}
                  onChange={(e) => setAmountToAdd(e.target.value)}
                  placeholder="Enter amount (LKR)"
                  className="w-full bg-slate-700 text-white p-3 rounded-lg mb-4"
                />

                <div className="flex gap-3">

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 border border-slate-600 text-gray-300 py-2 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-yellow-400 text-black py-2 rounded-lg font-semibold"
                  >
                    Confirm
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </StudentLayout>
  );
};

export default Wallet;
