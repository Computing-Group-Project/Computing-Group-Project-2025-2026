"""
Regenerate training CSVs from data.sql seed logic and retrain all AI models.

This script mirrors the GenerateData stored procedure in database/data.sql
to produce consistent training data, then retrains:
  - KNN recommendation model  (knn_model.pkl, user_item_matrix.pkl)
  - Item-canteen mapping       (item_canteen_map.json)
  - Time-based rules           (time_rules.json)
  - Combo association rules    (combo_rules.json)
  - Failing items list         (failing_items.json)
  - BOGO rules                 (bogo_rules.json)

Run from the ai-service/training/ directory:
    python regenerate_and_retrain.py
"""

import json
import os
import sys
import warnings

import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import MinMaxScaler

warnings.filterwarnings("ignore")

np.random.seed(42)

# ---------------------------------------------------------------------------
# 1. Menu items — mirrors INSERT INTO MenuItem from data.sql (GK prices)
# ---------------------------------------------------------------------------
MENU_ITEMS = {
    # Canteen 1: The Last Drop
    1:  (1, 120.00), 2:  (1,  45.00), 3:  (1,  85.00), 4:  (1, 110.00), 5:  (1,  95.00),   # Healthy
    6:  (1, 150.00), 7:  (1,  30.00), 8:  (1,  60.00), 9:  (1, 130.00), 10: (1, 160.00),    # Fast Food
    11: (1,  40.00), 12: (1,  55.00), 13: (1,  90.00), 14: (1,  45.00), 15: (1,  60.00),    # Breakfast
    16: (1, 110.00), 17: (1,  15.00),                                                         # Combo
    18: (1, 125.00),                                                                           # Failing

    # Canteen 2: Hex Core Cafe
    19: (2, 105.00), 20: (2,  40.00), 21: (2,  90.00), 22: (2, 115.00), 23: (2,  95.00),    # Healthy
    24: (2, 140.00), 25: (2,  35.00), 26: (2,  65.00), 27: (2, 135.00), 28: (2, 170.00),    # Fast Food
    29: (2,  35.00), 30: (2,  50.00), 31: (2,  95.00), 32: (2,  45.00), 33: (2,  60.00),    # Breakfast
    34: (2, 105.00), 35: (2,  20.00),                                                         # Combo
    36: (2, 110.00),                                                                           # Failing

    # Canteen 3: Skyline Sips
    37: (3, 130.00), 38: (3,  50.00), 39: (3,  85.00), 40: (3, 140.00), 41: (3, 100.00),    # Healthy
    42: (3, 120.00), 43: (3,  45.00), 44: (3,  70.00), 45: (3, 150.00), 46: (3, 180.00),    # Fast Food
    47: (3,  45.00), 48: (3,  60.00), 49: (3,  75.00), 50: (3,  50.00), 51: (3,  65.00),    # Breakfast
    52: (3,  80.00), 53: (3,  40.00),                                                         # Combo
    54: (3,  10.00),                                                                           # Failing
}

STAFF_IDS = {23, 43, 45, 48}
ADMIN_IDS = {61}
NUM_ORDERS = 2000

# Cluster ranges (matching data.sql)
# Cluster A: Healthy Eaters (1-20), Cluster B: Fast Food (21-40), Cluster C: Morning (41-60)
CLUSTER_ITEMS = {
    # (cafeteria_id): {cluster: [item_id_range]}
    1: {"A": range(1, 6),   "B": range(6, 11),  "C": range(11, 16)},
    2: {"A": range(19, 24), "B": range(24, 29),  "C": range(29, 34)},
    3: {"A": range(37, 42), "B": range(42, 47),  "C": range(47, 52)},
}

COMBO_PAIRS = {
    1: (16, 17),   # Lee Sin Fried Rice + Dragon Chilli Paste
    2: (34, 35),   # Zaun Street Noodles + Spicy Shroom Skewer
    3: (52, 53),   # Premium Iced Latte + Macaron Set
}

COMBO_PROBABILITY = 0.85


def get_cluster(user_id):
    if user_id <= 20:
        return "A"
    elif user_id <= 40:
        return "B"
    else:
        return "C"


def assign_time(user_id, base_date):
    """Assign realistic hour based on cluster (matching model_trainning.ipynb)."""
    if 41 <= user_id <= 60:
        hour = np.random.randint(6, 11)
    elif 21 <= user_id <= 40:
        hour = np.random.randint(11, 16)
    else:
        hour = np.random.randint(16, 21)
    minute = np.random.randint(0, 60)
    return base_date.replace(hour=hour, minute=minute)


def generate_csvs():
    """Generate orders.csv and order_items.csv matching data.sql procedure logic."""
    orders = []
    order_items = []
    order_id = 0
    order_item_id = 0

    for _ in range(NUM_ORDERS):
        user_id = np.random.randint(1, 61)
        cafeteria_id = np.random.randint(1, 4)
        days_ago = np.random.randint(0, 30)
        base_date = pd.Timestamp.now() - pd.Timedelta(days=days_ago)

        if user_id in STAFF_IDS or user_id in ADMIN_IDS:
            continue

        order_id += 1
        placed_at = assign_time(user_id, base_date)
        cluster = get_cluster(user_id)
        items_in_order = []

        item_range = list(CLUSTER_ITEMS[cafeteria_id][cluster])
        v_item_id = item_range[np.random.randint(0, len(item_range))]
        v_price = MENU_ITEMS[v_item_id][1]
        order_item_id += 1
        items_in_order.append({
            "order_item_id": order_item_id,
            "order_id": order_id,
            "item_id": v_item_id,
            "quantity": 1,
            "unit_price": v_price,
            "subtotal": v_price,
        })

        # Cluster B gets combo items with 85% probability
        if cluster == "B" and np.random.random() < COMBO_PROBABILITY:
            combo_a, combo_b = COMBO_PAIRS[cafeteria_id]
            price_a = MENU_ITEMS[combo_a][1]
            price_b = MENU_ITEMS[combo_b][1]
            order_item_id += 1
            items_in_order.append({
                "order_item_id": order_item_id,
                "order_id": order_id,
                "item_id": combo_a,
                "quantity": 1,
                "unit_price": price_a,
                "subtotal": price_a,
            })
            order_item_id += 1
            items_in_order.append({
                "order_item_id": order_item_id,
                "order_id": order_id,
                "item_id": combo_b,
                "quantity": 1,
                "unit_price": price_b,
                "subtotal": price_b,
            })

        total = sum(i["subtotal"] for i in items_in_order)
        orders.append({
            "order_id": order_id,
            "user_id": user_id,
            "cafeteria_id": cafeteria_id,
            "order_status": "COMPLETED",
            "total_amount": total,
            "placed_at": placed_at.strftime("%Y-%m-%d %H:%M:%S"),
            "confirmed_at": "",
            "completed_at": "",
            "special_instructions": "",
        })
        order_items.extend(items_in_order)

    orders_df = pd.DataFrame(orders)
    items_df = pd.DataFrame(order_items)

    orders_df.to_csv("orders.csv", index=False)
    items_df.to_csv("order_items.csv", index=False)

    print(f"Generated {len(orders_df)} orders and {len(items_df)} order items.")
    return orders_df, items_df


def train_recommendation_model(orders_df, items_df):
    """Retrain KNN model and generate item_canteen_map + time_rules (from model_trainning.ipynb)."""
    parent = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(parent), "data")
    os.makedirs(data_dir, exist_ok=True)

    orders_df["placed_at"] = pd.to_datetime(orders_df["placed_at"])
    df = pd.merge(items_df, orders_df, on="order_id")

    unique_items = df.drop_duplicates(subset=["item_id"])
    item_canteen_map = pd.Series(
        unique_items.cafeteria_id.values, index=unique_items.item_id
    ).to_dict()
    # Ensure all 54 items are present (some may not appear in random data)
    for item_id, (caf, _) in MENU_ITEMS.items():
        if item_id not in item_canteen_map:
            item_canteen_map[item_id] = caf

    with open(os.path.join(data_dir, "item_canteen_map.json"), "w") as f:
        json.dump({str(k): int(v) for k, v in item_canteen_map.items()}, f)
    print("item_canteen_map.json saved.")

    def get_time_bucket(hour):
        if 6 <= hour < 11:
            return "Morning"
        elif 11 <= hour < 16:
            return "Lunch"
        return "Evening"

    df["time_bucket"] = df["placed_at"].dt.hour.apply(get_time_bucket)
    time_rules = {}
    for bucket in ["Morning", "Lunch", "Evening"]:
        bucket_data = df[df["time_bucket"] == bucket]
        top_items = bucket_data["item_id"].value_counts().head(10).index.tolist()
        time_rules[bucket] = [int(i) for i in top_items]

    with open(os.path.join(data_dir, "time_rules.json"), "w") as f:
        json.dump(time_rules, f)
    print("time_rules.json saved.")

    purchase_counts = (
        df.groupby(["user_id", "item_id"]).size().reset_index(name="purchase_count")
    )
    user_item_matrix = (
        purchase_counts.pivot(index="user_id", columns="item_id", values="purchase_count")
        .fillna(0)
    )
    scaler = MinMaxScaler()
    normalized = pd.DataFrame(
        scaler.fit_transform(user_item_matrix.T).T,
        index=user_item_matrix.index,
        columns=user_item_matrix.columns,
    )

    knn = NearestNeighbors(n_neighbors=6, metric="cosine", algorithm="brute")
    knn.fit(normalized)

    import joblib
    joblib.dump(knn, os.path.join(data_dir, "knn_model.pkl"))
    normalized.to_pickle(os.path.join(data_dir, "user_item_matrix.pkl"))
    print("knn_model.pkl and user_item_matrix.pkl saved.")

    return df


def train_discount_models(df):
    """Retrain discount strategy rules (from discount_training.ipynb)."""
    try:
        from mlxtend.frequent_patterns import apriori, association_rules
    except ImportError:
        print("WARNING: mlxtend not installed — skipping discount rule generation.")
        print("Install with: pip install mlxtend")
        print("Existing combo_rules.json, failing_items.json, bogo_rules.json will be kept.")
        return

    parent = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(os.path.dirname(parent), "data")

    combo_rules = {}
    failing_items = {}
    bogo_rules = {}

    for canteen_id in sorted(df["cafeteria_id"].unique()):
        canteen_data = df[df["cafeteria_id"] == canteen_id]
        cid_str = str(int(canteen_id))

        basket = (
            canteen_data.groupby(["order_id", "item_id"])["quantity"]
            .sum()
            .unstack()
            .reset_index()
            .fillna(0)
            .set_index("order_id")
        )
        basket = basket.map(lambda x: 1 if x > 0 else 0)
        frequent_itemsets = apriori(basket, min_support=0.03, use_colnames=True)
        canteen_combos = []

        if not frequent_itemsets.empty:
            rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.2)
            rules = rules[
                (rules["antecedents"].apply(len) == 1)
                & (rules["consequents"].apply(len) == 1)
            ]
            rules = rules.sort_values("confidence", ascending=False)
            seen_pairs = set()
            for _, r in rules.iterrows():
                item_a = int(list(r["antecedents"])[0])
                item_b = int(list(r["consequents"])[0])
                pair = tuple(sorted([item_a, item_b]))
                if pair not in seen_pairs:
                    seen_pairs.add(pair)
                    canteen_combos.append({
                        "item_a": item_a,
                        "item_b": item_b,
                        "confidence": round(r["confidence"], 3),
                        "lift": round(r["lift"], 3),
                    })
                    if len(canteen_combos) >= 10:
                        break

        combo_rules[cid_str] = canteen_combos

        item_sales = canteen_data.groupby("item_id")["quantity"].sum().reset_index()
        item_sales = item_sales.sort_values("quantity", ascending=True)
        low_threshold = item_sales["quantity"].quantile(0.25)
        critical_threshold = item_sales["quantity"].quantile(0.10)
        high_threshold = item_sales["quantity"].quantile(0.90)

        failing = item_sales[item_sales["quantity"] <= low_threshold]
        max_fail = failing["quantity"].max() if not failing.empty else 1
        failing_list = []
        for _, row in failing.iterrows():
            severity = 1.0 - (row["quantity"] / max_fail) if max_fail > 0 else 1.0
            failing_list.append({
                "item_id": int(row["item_id"]),
                "quantity": int(row["quantity"]),
                "severity": round(severity, 3),
            })
        failing_items[cid_str] = failing_list

        critical_items = item_sales[item_sales["quantity"] <= critical_threshold]["item_id"].tolist()
        popular_items = item_sales[item_sales["quantity"] >= high_threshold]["item_id"].tolist()
        canteen_bogos = []
        for item in critical_items[:3]:
            canteen_bogos.append({"bogo_type": "clearance", "buy_item": int(item), "get_item": int(item)})
        if popular_items and critical_items:
            for i in range(min(len(popular_items), len(critical_items), 3)):
                canteen_bogos.append({
                    "bogo_type": "cross_sell",
                    "buy_item": int(popular_items[-i - 1]),
                    "get_item": int(critical_items[i]),
                })
        bogo_rules[cid_str] = canteen_bogos

    with open(os.path.join(data_dir, "combo_rules.json"), "w") as f:
        json.dump(combo_rules, f, indent=4)
    with open(os.path.join(data_dir, "failing_items.json"), "w") as f:
        json.dump(failing_items, f, indent=4)
    with open(os.path.join(data_dir, "bogo_rules.json"), "w") as f:
        json.dump(bogo_rules, f, indent=4)
    print("combo_rules.json, failing_items.json, bogo_rules.json saved.")


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print("=" * 60)
    print("Regenerating training data from data.sql logic...")
    print("=" * 60)

    orders_df, items_df = generate_csvs()

    print("\nTraining recommendation model...")
    df = train_recommendation_model(orders_df, items_df)

    print("\nTraining discount strategies...")
    train_discount_models(df)

    print("\n" + "=" * 60)
    print("All models and data files regenerated successfully!")
    print("=" * 60)
