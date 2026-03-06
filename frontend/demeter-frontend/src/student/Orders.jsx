const sampleOrders = [
	{
		id: 'OD-1284',
		placedAt: 'Today, 10:42 AM',
		status: 'Preparing',
		total: 27,
		items: ['Scholar\'s Scone x1', 'Void Latte x1'],
	},
	{
		id: 'OD-1280',
		placedAt: 'Yesterday, 3:11 PM',
		status: 'Completed',
		total: 18,
		items: ['Nebula Noodles x1', 'Mineral Water x1'],
	},
	{
		id: 'OD-1275',
		placedAt: 'Mar 04, 9:04 AM',
		status: 'Cancelled',
		total: 12,
		items: ['Scholar\'s Scone x1'],
	},
];

function Orders() {
	const getStatusClasses = (status) => {
		if (status === 'Preparing') {
			return 'bg-amber-500/15 text-amber-300 border-amber-400/40';
		}

		if (status === 'Completed') {
			return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40';
		}

		return 'bg-rose-500/15 text-rose-300 border-rose-400/40';
	};

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
			<div className="mx-auto max-w-6xl">
				<header className="mb-7">
					<h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Your Orders</h1>
					<p className="mt-2 text-lg text-slate-300">Track current and past cafeteria orders.</p>
				</header>

				<section className="space-y-4">
					{sampleOrders.map((order) => (
						<article
							key={order.id}
							className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-[0_10px_24px_rgba(0,0,0,0.28)]"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<p className="text-xl font-semibold text-white">Order {order.id}</p>
									<p className="mt-1 text-sm text-slate-400">Placed: {order.placedAt}</p>
									<ul className="mt-4 space-y-1 text-slate-200">
										{order.items.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</div>

								<div className="sm:text-right">
									<span
										className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${getStatusClasses(order.status)}`}
									>
										{order.status}
									</span>
									<p className="mt-4 text-3xl font-bold text-amber-300">GK {order.total}</p>
								</div>
							</div>
						</article>
					))}
				</section>
			</div>
		</main>
	);
}

export default Orders;
