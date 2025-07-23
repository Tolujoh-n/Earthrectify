import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import axios from "axios";

const WalletScreen = () => {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get("/api/transactions", config);
        setTransactions(data);
      } catch (error) {
        // Handle error
      }
    };
    fetchTransactions();
  }, []);

  // Dummy data for now
  const tokens = [
    { token: "Hbar", balance: 0, usd: 0 },
    { token: "ERECO", balance: 1200, usd: 120 },
    { token: "VERECO", balance: 50, usd: 5 },
  ];

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Wallet</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Token
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                USD Equivalent
              </th>
            </tr>
          </thead>
          <tbody>{/* Table rows will go here */}</tbody>
        </table>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx._id}>
                  <td className="px-5 py-3 border-b border-gray-200 text-sm">
                    {tx.type}
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-sm">
                    {tx.amount}
                  </td>
                  <td className="px-5 py-3 border-b border-gray-200 text-sm">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 space-x-2">
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Deposit
        </button>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Transfer
        </button>
        <button
          onClick={() => setIsSwapModalOpen(true)}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
        >
          Swap
        </button>
      </div>
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      >
        <h3 className="text-lg font-bold mb-4">Deposit</h3>
        <p>Deposit to:</p>
        <div className="flex items-center space-x-2 mt-2">
          <p className="font-mono bg-gray-100 p-2 rounded">
            {userInfo.username}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(userInfo.username)}
            className="text-sm text-green-600"
          >
            Copy
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
      >
        <h3 className="text-lg font-bold mb-4">Transfer</h3>
        {/* Transfer form */}
      </Modal>
      <Modal isOpen={isSwapModalOpen} onClose={() => setIsSwapModalOpen(false)}>
        <h3 className="text-lg font-bold mb-4">Swap</h3>
        {/* Swap form */}
      </Modal>
    </div>
  );
};

export default WalletScreen;
