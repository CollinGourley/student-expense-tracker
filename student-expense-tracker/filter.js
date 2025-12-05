// Filter Expenses
const [expenses, setExpenses] = useState([]);
const [filter, setFilter] = useState('all');

<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
  <Button title="All" onPress={() => { setFilter('all'); loadExpenses(); }} />
  <Button title="This Week" onPress={() => { setFilter('week'); loadExpenses(); }} />
  <Button title="This Month" onPress={() => { setFilter('month'); loadExpenses(); }} />
</View>
const loadExpenses = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM expenses ORDER BY date DESC',
      [],
      (_, { rows }) => {
        let data = rows._array;
        data = applyFilter(data);
        setExpenses(data);
      },
      (_, error) => console.log('Error fetching expenses:', error)
    );
  });
};
const applyFilter = (data) => {
  const now = new Date();

  return data.filter(exp => {
    const expDate = new Date(exp.date);

    if (filter === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0,0,0,0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      endOfWeek.setHours(23,59,59,999);

      return expDate >= startOfWeek && expDate <= endOfWeek;
    }

    if (filter === 'month') {
      return expDate.getMonth() === now.getMonth() &&
             expDate.getFullYear() === now.getFullYear();
    }

    return true; // 'all'
  });
};

// Show total Spending
const totalSpending = () => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2);
};
const categoryTotals = () => {
  const totals = {};
  expenses.forEach(exp => {
    totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
  });
  return totals;
};
<View style={{ marginVertical: 10 }}>
  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
    Total Spending: ${totalSpending()}
  </Text>

  {Object.entries(categoryTotals()).map(([category, total]) => (
    <Text key={category}>
      {category}: ${total.toFixed(2)}
    </Text>
  ))}
</View>
// Edit existing expenses
const [modalVisible, setModalVisible] = useState(false);
const [editingExpense, setEditingExpense] = useState(null);

const [amount, setAmount] = useState('');
const [category, setCategory] = useState('');
const [note, setNote] = useState('');
const [date, setDate] = useState('');

const openEditModal = (expense) => {
  setEditingExpense(expense);
  setAmount(expense.amount.toString());
  setCategory(expense.category);
  setNote(expense.note);
  setDate(expense.date);
  setModalVisible(true);
};
  data={expenses}
  keyExtractor={item => item.id.toString()}
  renderItem=({ item }) => 
    <TouchableOpacity onPress={() => openEditModal(item)}>
      <View style={{ padding: 10, borderBottomWidth: 1 }}>
        <Text>{item.category} - ${item.amount} ({item.date})</Text>
        <Text>{item.note}</Text>
      </View>
    </TouchableOpacity>


const saveEdit = () => {
  if (!editingExpense) return;

  db.transaction(tx => {
    tx.executeSql(
      'UPDATE expenses SET amount=?, category=?, note=?, date=? WHERE id=?',
      [parseFloat(amount), category, note, date, editingExpense.id],
      (_, result) => {
        console.log('Expense updated:', result);
        setModalVisible(false);
        setEditingExpense(null);
        loadExpenses(); // refresh list and totals
      },
      (_, error) => console.log('Error updating expense:', error)
    );
  });
};
<Modal visible={modalVisible} animationType="slide">
  <View style={{ flex: 1, padding: 20 }}>
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Edit Expense</Text>

    <TextInput
      placeholder="Amount"
      keyboardType="numeric"
      value={amount}
      onChangeText={setAmount}
      style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
    />

    <TextInput
      placeholder="Category"
      value={category}
      onChangeText={setCategory}
      style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
    />

    <TextInput
      placeholder="Note"
      value={note}
      onChangeText={setNote}
      style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
    />

    <TextInput
      placeholder="Date (YYYY-MM-DD)"
      value={date}
      onChangeText={setDate}
      style={{ borderWidth: 1, marginBottom: 20, padding: 5 }}
    />

    <Button title="Save" onPress={saveEdit} />
    <View style={{ height: 10 }} />
    <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
  </View>
</Modal>