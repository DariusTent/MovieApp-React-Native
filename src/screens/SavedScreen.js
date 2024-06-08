import {
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { image500 } from "../../utils/moviesapi";

const { width, height } = Dimensions.get("window");

export default function SavedScreen() {
  const navigation = useNavigation();
  const [savedMovies, setSavedMovies] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        try {
          const savedMovies = await AsyncStorage.getItem("savedMovies");
          const savedMoviesArray = savedMovies ? JSON.parse(savedMovies) : [];
          setSavedMovies(savedMoviesArray);
          console.log("Pull saved movie from AsyncStorage");

          const darkModeSetting = await AsyncStorage.getItem("darkMode");
          if (darkModeSetting !== null) {
            setDarkMode(JSON.parse(darkModeSetting));
            console.log("Dark mode setting loaded from AsyncStorage");
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadSettings();
    }, [navigation])
  );

  return (
    <ScrollView contentContainerStyle={[styles.scrollViewContent, darkMode && styles.darkScrollViewContent]}>
      <ImageBackground
        source={require("../../assets/images/homescreen.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay to darken/lighten the background */}
        <View style={[styles.overlay, darkMode && styles.darkOverlay]} />
        <View style={[styles.container, darkMode && styles.darkContainer]}>
          <View style={styles.header}>
            <Text style={[styles.headerText, darkMode && styles.darkHeaderText]}>Saved Movies</Text>
          </View>

          {savedMovies.length > 0 ? (
            <View style={styles.moviesContainer}>
              {savedMovies.map((movie, index) => (
                <View style={styles.movieItem} key={index}>
                  <TouchableOpacity
                    onPress={() => navigation.push("Movie", movie)}
                  >
                    <Image
                      source={{
                        uri: image500(movie.poster_path),
                      }}
                      style={styles.movieImage}
                    />
                    <Text style={[styles.movieTitle, darkMode && styles.darkMovieTitle]}>
                      {movie.title.length > 15
                        ? movie.title.slice(0, 15) + "..."
                        : movie.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyMessageContainer}>
              <Text style={[styles.emptyMessage, darkMode && styles.darkEmptyMessage]}>You have not saved any movies yet</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  darkScrollViewContent: {
    backgroundColor: "#121212", // Dark mode background color
  },
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
    padding: 16,
    backgroundColor: "transparent", // Set backgroundColor to transparent to show the overlay effect
  },
  darkContainer: {
    backgroundColor: "transparent", // Same here for dark mode
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 48,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black", // Light mode text color
  },
  darkHeaderText: {
    color: "white", // Dark mode text color
  },
  moviesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  movieItem: {
    marginVertical: 8,
  },
  movieImage: {
    width: width * 0.41,
    height: height * 0.25,
    borderRadius: 16,
  },
  movieTitle: {
    color: "#000", // Light mode text color
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  darkMovieTitle: {
    color: "#D1D5DB", // Dark mode text color
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  emptyMessage: {
    fontSize: 18,
    color: "#000", // Light mode text color
  },
  darkEmptyMessage: {
    color: "#D1D5DB", // Dark mode text color
  },
});
