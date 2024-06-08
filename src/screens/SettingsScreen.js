import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load settings from AsyncStorage when component mounts
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const darkModeSetting = await AsyncStorage.getItem('darkMode');
      if (darkModeSetting !== null) {
        setDarkMode(JSON.parse(darkModeSetting));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const clearSavedMovies = async () => {
    try {
      await AsyncStorage.removeItem('savedMovies');
      console.log('Cleared all saved movies');
    } catch (error) {
      console.error('Error clearing saved movies', error);
    }
  };

  useEffect(() => {
    // Save settings to AsyncStorage whenever dark mode is toggled
    saveSettings();
  }, [darkMode]);

  return (
    <ImageBackground
      source={require("../../assets/images/homescreen.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay to darken/lighten the background */}
      <View style={[styles.overlay, darkMode && styles.darkOverlay]} />
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <Text style={[styles.title, darkMode && styles.darkTitle]}>Settings</Text>
        <View style={styles.setting}>
          <Text style={darkMode ? styles.darkText : styles.lightText}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity onPress={clearSavedMovies} style={[styles.clearButton, darkMode && styles.darkButton]}>
          <Text style={styles.clearButtonText}>Clear Saved Movies</Text>
        </TouchableOpacity>
        {/* Add more settings here */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light mode semi-transparent overlay
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark mode semi-transparent overlay
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'transparent', // Set backgroundColor to transparent to show the overlay effect
    paddingTop: 50, // Adjust to position the Settings title
  },
  darkContainer: {
    backgroundColor: 'transparent', // Same here for dark mode
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000', // Light mode text color
  },
  darkTitle: {
    color: '#fff', // Dark mode text color
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 10,
  },
  lightText: {
    color: '#000', // Light mode text color
  },
  darkText: {
    color: '#fff', // Dark mode text color
  },
  clearButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  darkButton: {
    backgroundColor: '#4C4C4C', // Dark mode button color
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default SettingsScreen;
