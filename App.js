// App.js
import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import ExpenseScreen from './ExpenseScreen';

export default function App() {
  return (
    <SQLiteProvider databaseName="expenses.db">
      <ExpenseScreen />
    </SQLiteProvider>
  );
}
db.transaction(tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      date TEXT NOT NULL
    );`
  );
});
const addExpense = (amount, category, note) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO expenses (amount, category, note, date) VALUES (?, ?, ?, ?)',
      [amount, category, note, today],
      (_, result) => {
        console.log('Expense added:', result.insertId);
        loadExpenses(); // refresh list if you have a function to load expenses
      },
      (_, error) => console.log('Error inserting expense:', error)
    );
  });
};
import React, { useState, useEffect } from 'react';
