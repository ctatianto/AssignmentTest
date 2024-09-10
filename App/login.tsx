import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MarketDataScreen from './marketdata';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [pin, setPin] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await axios.get('https://api.kucoin.com/api/v1/symbols');
        const symbolOptions = response.data.data.map(symbol => ({
          label: symbol.symbol,
          value: symbol.symbol,
        }));
        setSymbols(symbolOptions);
      } catch (error) {
        console.error('Error fetching symbols:', error);
        Alert.alert('Error', 'Failed to fetch symbols. Please try again later.');
      }
    };
    fetchSymbols();
  }, []);

  const handleLogin = async () => {
    if (!selectedSymbol || !pin) {
      Alert.alert('Error', 'Please select a symbol and enter your PIN.');
      return;
    }
  
    try {
      // Update this URL to your Express server URL
      const response = await axios.post('http://localhost:3000/api/authenticate', { symbol: selectedSymbol, pin: pin });
      
      if (response.status === 200) {
        const { authtoken } = response.data;
        console.log('Navigating to Market with token:', authtoken);
        navigation.navigate('Market1', { authtoken, symbol: selectedSymbol });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
      } 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Symbol:</Text>
      <DropDownPicker
        open={open}
        value={selectedSymbol}
        items={symbols}
        setOpen={setOpen}
        setValue={setSelectedSymbol}
        setItems={setSymbols}
        placeholder="Select a symbol"
        style={styles.dropdown}
        containerStyle={styles.dropdownContainer}
        dropDownContainerStyle={styles.dropDownContainer} // Style for the dropdown list container
        onChangeValue={(value) => {
          console.log("Selected Value: ", value); // Debugging statement
          setSelectedSymbol(value);
        }}
      />
      <Text style={styles.label}>Enter PIN:</Text>
      <TextInput
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        style={styles.input}
        placeholder="Enter PIN"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  dropdownContainer: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  dropDownContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
});

export default LoginScreen;
