// screens/MarketScreen1.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const MarketScreen1 = ({ route }) => {
  const { authtoken, symbol } = route.params; // Destructure the token and symbol from route.params
  const [data, setData] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.kucoin.com/api/v1/market/orderbook/level2_100?symbol=${symbol}`, {
          headers: {
            'Authorization': `Bearer ${authtoken}` // Include the token in the request headers if needed
          }
        });
        setData(response.data.data);
        setError('');
      } catch (err) {
        setError('Error fetching market data');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, authtoken]); // Add authtoken to the dependency array

  const processOrders = (orders) => {
    const groupedOrders = {};
    orders.forEach(([price, size]) => {
      const roundedPrice = parseFloat(price).toFixed(10);
      if (groupedOrders[roundedPrice]) {
        groupedOrders[roundedPrice] += parseFloat(size);
      } else {
        groupedOrders[roundedPrice] = parseFloat(size);
      }
    });
    return groupedOrders;
  };

  const calculateAverage = (orders) => {
    const totalSize = orders.reduce((acc, [price, size]) => acc + parseFloat(size), 0);
    const totalValue = orders.reduce((acc, [price, size]) => acc + (parseFloat(price) * parseFloat(size)), 0);
    return totalSize === 0 ? 0 : totalValue / totalSize;
  };

  const bidsGrouped = processOrders(data.bids || []);
  const asksGrouped = processOrders(data.asks || []);
  const avgBidPrice = calculateAverage(data.bids || []);
  const avgAskPrice = calculateAverage(data.asks || []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.header}>Price and Size (Bids):</Text>
            {Object.entries(bidsGrouped).map(([price, size]) => (
              <Text key={price} style={styles.orderText}>{`$${price}: ${size.toFixed(2)}`}</Text>
            ))}
            <Text style={styles.summaryText}>Average Bid Price: ${avgBidPrice.toFixed(10)}</Text>
            <Text style={styles.summaryText}>Total Bid Size: {Object.values(bidsGrouped).reduce((a, b) => a + b, 0).toFixed(2)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Price and Size (Asks):</Text>
            {Object.entries(asksGrouped).map(([price, size]) => (
              <Text key={price} style={styles.orderText}>{`$${price}: ${size.toFixed(2)}`}</Text>
            ))}
            <Text style={styles.summaryText}>Average Ask Price: ${avgAskPrice.toFixed(10)}</Text>
            <Text style={styles.summaryText}>Total Ask Size: {Object.values(asksGrouped).reduce((a, b) => a + b, 0).toFixed(2)}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  orderText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#555'
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
    color: '#000'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default MarketScreen1;
