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
