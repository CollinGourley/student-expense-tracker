import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory-native';

const CategoryPieChart = ({ data }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category (%)</Text>

      <VictoryPie
        data={data}
        x="x"
        y="y"
        labels={({ datum }) => `${datum.x}\n${datum.y}%`}
        innerRadius={40}
        padAngle={2}
        style={{
          labels: { fill: "black", fontSize: 12, fontWeight: "600" },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  }
});

export default CategoryPieChart;