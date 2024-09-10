import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

const MarketDataScreen = ({ route }) => {
  const { authtoken, symbol } = route.params;
  const [data, setData] = useState({ bids: [], asks: [] });
  const [ws, setWs] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:3000/ws-token')
      .then(response => {

        let token = response.data.data.token;
        let instanceServers = response.data.data.instanceServers;
        // Debugging: Verify the response data
        console.log('WebSocket token response:', response.data);
        console.log('Token:', token);
        console.log('Instance Servers:', instanceServers[0].endpoint);

        if (!token || !instanceServers || instanceServers.length === 0) {
          console.error('Invalid WebSocket token response structure');
          return;
        }

        // Construct WebSocket URL
        const wsEndpoint = `${instanceServers[0].endpoint}?connectId=8888&token=${token}`;
        console.log('Connecting to WebSocket:', wsEndpoint);

        // Initialize WebSocket
        const ws = new WebSocket(wsEndpoint);

        ws.onopen = () => {
          console.log('WebSocket connection opened');
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log('Received WebSocket message:', message);
            if (message.type === 'message' && message.data) {
              const { data } = message;
              setData({
                bids: data.bids || [],
                asks: data.asks || [],
              });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('WebSocket connection closed');
        };

        setWs(ws);

        return () => {
          if (ws) ws.close();
        };
      })
      .catch(error => {
        console.error('Error fetching WebSocket token:', error);
      });
  }, [symbol]);

  const processOrderData = (orders) => {
    if (!orders || !Array.isArray(orders)) return [];
    const grouped = {};
    orders.forEach(([price, size]) => {
      const roundedPrice = parseFloat(price).toFixed(1);
      if (!grouped[roundedPrice]) {
        grouped[roundedPrice] = 0;
      }
      grouped[roundedPrice] += parseFloat(size);
    });
    return Object.entries(grouped).map(([price, size]) => [parseFloat(price), size]);
  };

  const calculateStats = (orders) => {
    if (!orders || orders.length === 0) return { totalSize: 0, averagePrice: 0 };
    const totalSize = orders.reduce((acc, [, size]) => acc + size, 0);
    const averagePrice = orders.reduce((acc, [price, size]) => acc + (price * size), 0) / totalSize;
    return { totalSize, averagePrice };
  };

  const bidOrders = processOrderData(data.bids);
  const askOrders = processOrderData(data.asks);
  const bidStats = calculateStats(bidOrders);
  const askStats = calculateStats(askOrders);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Market Data for {symbol}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Bids:</Text>
        {bidOrders.map(([price, size], index) => (
          <Text key={index} style={styles.orderItem}>{`Price: ${price}, Size: ${size.toFixed(2)}`}</Text>
        ))}
        <Text style={styles.stats}>Bid Total Size: {bidStats.totalSize.toFixed(8)}</Text>
        <Text style={styles.stats}>Bid Average Price: {bidStats.averagePrice.toFixed(2)}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Asks:</Text>
        {askOrders.map(([price, size], index) => (
          <Text key={index} style={styles.orderItem}>{`Price: ${price}, Size: ${size.toFixed(2)}`}</Text>
        ))}
        <Text style={styles.stats}>Ask Total Size: {askStats.totalSize.toFixed(8)}</Text>
        <Text style={styles.stats}>Ask Average Price: {askStats.averagePrice.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  orderItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  stats: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default MarketDataScreen;
