import React, { useState } from 'react';

const Wallet = () => {
	const [balance, setBalance] = useState(1500.00);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [amountToAdd, setAmountToAdd] = useState('');

	const [transactions, setTransactions] = useState([
		{
			transaction_id: 101,
			transaction_type: 'ORDER_PAYMENT',
			amount: -450.00,
			balance_before: 1950.00,
			balance_after: 1500.00,
			reference_id: 'ORD-2024-001',
			description: 'Payment for Order #ORD-2024-001 at Hexcore Café',
			created_at: '2024-03-10 12:30:00'
		},
		{
			transaction_id: 100,
			transaction_type: 'TOP_UP',
			amount: 1000.00,
			balance_before: 950.00,
			balance_after: 1950.00,
			reference_id: 'PAY-8821',
			description: 'Wallet top-up via Admin Console',
			created_at: '2024-03-09 09:15:00'
		},
		{
			transaction_id: 99,
			transaction_type: 'REFUND',
			amount: 350.00,
			balance_before: 600.00,
			balance_after: 950.00,
			reference_id: 'ORD-2024-000',
			description: 'Refund for cancelled Order #ORD-2024-000',
			created_at: '2024-03-08 14:20:00'
		}
	]);

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setAmountToAdd('');
	};

	const handleAddFunds = (e) => {
		e.preventDefault();
		const amount = parseFloat(amountToAdd);

		if (!amount || amount <= 0) return;

		// Simulate Backend Logic
		const newBalance = balance + amount;

		const newTransaction = {
			transaction_id: transactions.length + 102,
			transaction_type: 'TOP_UP',
			amount: amount,
			balance_before: balance,
			balance_after: newBalance,
			reference_id: `PAY-${Math.floor(Math.random() * 10000)}`,
			description: 'User initiated top-up (LKR to GK conversion)',
			created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
		};

		setBalance(newBalance);
		setTransactions([newTransaction, ...transactions]);
		handleCloseModal();
	};

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6">
			<div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex justify-between items-center">
				<div>
					<h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Current Balance</h2>
					<div className="flex items-baseline mt-2">
						<span className="text-4xl font-extrabold text-gray-900">{balance.toFixed(2)}</span>
						<span className="ml-2 text-xl font-semibold text-yellow-600">GK</span>
					</div>
					<p className="text-sm text-gray-400 mt-1">1 GK = 1 LKR</p>
				</div>

				<button
					onClick={handleOpenModal}
					className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
				>
					<span>+ Add Funds</span>
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
				<div className="p-6 border-b border-gray-100">
					<h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
						<tr>
							<th className="p-4 border-b">Date</th>
							<th className="p-4 border-b">Description</th>
							<th className="p-4 border-b">Type</th>
							<th className="p-4 border-b">Ref ID</th>
							<th className="p-4 border-b text-right">Amount (GK)</th>
							<th className="p-4 border-b text-right">Balance After</th>
						</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 text-sm text-gray-700">
						{transactions.map((tx) => (
							<tr key={tx.transaction_id} className="hover:bg-gray-50 transition-colors">
								<td className="p-4 whitespace-nowrap text-gray-500">{tx.created_at}</td>
								<td className="p-4 font-medium">{tx.description}</td>
								<td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
						tx.transaction_type === 'TOP_UP' ? 'bg-green-100 text-green-700' :
							tx.transaction_type === 'REFUND' ? 'bg-blue-100 text-blue-700' :
								'bg-red-100 text-red-700'
					}`}>
                      {tx.transaction_type}
                    </span>
								</td>
								<td className="p-4 text-gray-500 font-mono text-xs">{tx.reference_id}</td>
								<td className={`p-4 text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
									{tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
								</td>
								<td className="p-4 text-right text-gray-500">
									{tx.balance_after.toFixed(2)}
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
					<div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 transform transition-all">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-xl font-bold text-gray-800">Add Funds</h3>
							<button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
								✕
							</button>
						</div>

						<form onSubmit={handleAddFunds}>
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Amount (LKR)
								</label>
								<div className="relative rounded-md shadow-sm">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<span className="text-gray-500 sm:text-sm">Rs.</span>
									</div>
									<input
										type="number"
										min="1"
										required
										className="block w-full pl-10 pr-12 py-3 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
										placeholder="0.00"
										value={amountToAdd}
										onChange={(e) => setAmountToAdd(e.target.value)}
									/>
									<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
										<span className="text-gray-500 sm:text-sm">LKR</span>
									</div>
								</div>
								<p className="mt-2 text-xs text-gray-500">
									Conversion Rate: 1 LKR = 1 GK
								</p>
							</div>

							<div className="bg-gray-50 p-4 rounded-lg mb-6 flex justify-between items-center">
								<span className="text-sm text-gray-600">You will receive:</span>
								<span className="text-lg font-bold text-yellow-600">
                  {amountToAdd ? parseFloat(amountToAdd).toFixed(2) : '0.00'} GK
                </span>
							</div>

							<div className="flex gap-3">
								<button
									type="button"
									onClick={handleCloseModal}
									className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
								>
									Confirm Payment
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

		</div>
	);
};

export default Wallet;