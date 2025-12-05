export function getCategoryPercentages(expenses) {
  // Sum total per category
  const totals = {};
  let grandTotal = 0;

  expenses.forEach(exp => {
    const amount = Number(exp.amount);
    const cat = exp.category;

    if (!totals[cat]) totals[cat] = 0;
    totals[cat] += amount;
    grandTotal += amount;
  });

  // Convert totals → percentages
  return Object.entries(totals).map(([category, amount]) => ({
    x: category,
    y: grandTotal === 0 ? 0 : Math.round((amount / grandTotal) * 100)
  }));
}

[
  { x: "Food", y: 42 },
  { x: "Books", y: 33 },
  { x: "Transport", y: 25 }
];