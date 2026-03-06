import { useMemo, useState } from 'react';

const initialCartItems = [
	{
		id: 1,
		name: "Scholar's Scone",
		price: 12,
		quantity: 1,
		image:
			'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80',
	},
];

const suggestionItem = {
	id: 201,
	name: 'Void Latte',
	price: 15,
	image:
		'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
};

function Cart() {
	const [cartItems, setCartItems] = useState(initialCartItems);
	const currentBalance = 450;

	const subtotal = useMemo(
		() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
		[cartItems],
	);

	const handleIncrease = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
			),
		);
	};

	const handleDecrease = (itemId) => {
		setCartItems((prevItems) =>
			prevItems
				.map((item) =>
					item.id === itemId
						? { ...item, quantity: Math.max(0, item.quantity - 1) }
						: item,
				)
				.filter((item) => item.quantity > 0),
		);
	};

	const handleRemove = (itemId) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
	};

	const handleAddSuggestion = () => {
		setCartItems((prevItems) => {
			const existing = prevItems.find((item) => item.id === suggestionItem.id);
			if (existing) {
				return prevItems.map((item) =>
					item.id === suggestionItem.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				);
			}

			return [...prevItems, { ...suggestionItem, quantity: 1 }];
		});
	};

	return (
		<main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
			<div className="mx-auto w-full max-w-7xl">
				<h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
					Shopping Cart
				</h1>

				<div className="grid gap-8 lg:grid-cols-[1.55fr_1fr]">
					<section className="space-y-6">
						{cartItems.length === 0 ? (
							<div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-8 text-center text-slate-300">
								Your cart is empty. Add something tasty to continue.
							</div>
						) : (
							cartItems.map((item) => (
								<article
									key={item.id}
									className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/80 shadow-[0_10px_30px_rgba(0,0,0,0.28)]"
								>
									<div className="grid min-h-44 grid-cols-[120px_1fr_auto] gap-4 sm:grid-cols-[160px_1fr_auto]">
										<img
											src={item.image}
											alt={item.name}
											className="h-full w-full object-cover"
										/>

										<div className="flex flex-col justify-between py-5">
											<div>
												<h2 className="text-xl font-semibold text-white">{item.name}</h2>
												<p className="mt-2 text-lg text-slate-300">Qty: {item.quantity}</p>
											</div>

											<div className="mt-4 flex items-center gap-2">
												<button
													type="button"
													onClick={() => handleDecrease(item.id)}
													className="h-9 w-9 rounded-lg border border-slate-500 bg-slate-800 text-lg font-semibold text-white transition hover:bg-slate-700"
													aria-label={`Decrease quantity of ${item.name}`}
												>
													-
												</button>
												<span className="w-8 text-center text-base font-semibold text-slate-100">
													{item.quantity}
												</span>
												<button
													type="button"
													onClick={() => handleIncrease(item.id)}
													className="h-9 w-9 rounded-lg border border-slate-500 bg-slate-800 text-lg font-semibold text-white transition hover:bg-slate-700"
													aria-label={`Increase quantity of ${item.name}`}
												>
													+
												</button>
											</div>
										</div>

										<div className="flex min-w-28 flex-col items-end justify-between px-5 py-5">
											<p className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
												GK {item.price * item.quantity}
											</p>

											<button
												type="button"
												onClick={() => handleRemove(item.id)}
												className="rounded-lg border border-rose-500/40 px-3 py-1 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/10"
											>
												Remove
											</button>
										</div>
									</div>
								</article>
							))
						)}

						<section className="rounded-3xl border border-cyan-700/35 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 p-5">
							<p className="mb-4 text-2xl font-semibold text-white">Pairs well with your order</p>

							<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-4">
									<img
										src={suggestionItem.image}
										alt={suggestionItem.name}
										className="h-16 w-16 rounded-2xl object-cover"
									/>
									<div>
										<p className="text-xl font-semibold text-white">{suggestionItem.name}</p>
										<p className="text-lg text-slate-300">GK {suggestionItem.price}</p>
									</div>
								</div>

								<button
									type="button"
									onClick={handleAddSuggestion}
									className="rounded-xl bg-slate-700 px-6 py-3 text-lg font-semibold text-slate-100 transition hover:bg-slate-600"
								>
									Add
								</button>
							</div>
						</section>
					</section>

					<aside className="h-fit rounded-3xl border border-slate-700 bg-slate-900/85 p-8 shadow-[0_14px_30px_rgba(0,0,0,0.28)] lg:sticky lg:top-6">
						<h2 className="text-4xl font-bold text-white">Order Summary</h2>

						<div className="mt-8 border-b border-slate-700 pb-4">
							<div className="flex items-center justify-between text-2xl">
								<span className="text-slate-300">Subtotal</span>
								<span className="font-semibold text-white">GK {subtotal}</span>
							</div>
						</div>

						<div className="mt-4 flex items-center justify-between text-4xl font-bold">
							<span className="text-white">Total</span>
							<span className="text-amber-300">GK {subtotal}</span>
						</div>

						<div className="mt-7 rounded-2xl bg-slate-700/60 px-5 py-4 text-center text-xl text-slate-200">
							Current Balance: <span className="font-bold text-white">GK {currentBalance}</span>
						</div>

						<button
							type="button"
							className="mt-7 w-full rounded-2xl bg-yellow-400 px-6 py-4 text-2xl font-bold text-black transition hover:bg-yellow-300"
						>
							Pay with Gold Krakens
						</button>
					</aside>
				</div>
			</div>
		</main>
	);
}

export default Cart;
