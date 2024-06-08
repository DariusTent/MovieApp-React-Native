import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import TrendingMovies from "../components/TrendingMovie";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGenres,
  fetchPopularMovie,
  fetchTopRatedMovie,
  fetchTrendingMovie,
  fetchUpComingMovie,
} from "../../utils/moviesapi";
import Loading from "../components/Loading";
import TopRatedMovies from "../components/TopRatedMovies";
import PopularMovie from "../components/PopularMovie";
import UpcomingMovie from "../components/UpcomingMovie";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [trending, SetTrending] = useState([]);
  const [topRated, SetTopRated] = useState([]);
  const [popular, SetPopular] = useState([]);
  const [upcoming, SetUpcoming] = useState([]);
  const [genre, SetGenres] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        try {
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


  const { isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovie,
    onSuccess: (data) => {
      SetTrending(data.results);
    },
    onError: (error) => {
      console.log("Error fetching trending Movies", error);
    },
  });

  const { isLoading: isTopRatedLoading } = useQuery({
    queryKey: ["topratedMovies"],
    queryFn: fetchTopRatedMovie,
    onSuccess: (data) => {
      SetTopRated(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Top Rated Movies", error);
    },
  });

  const { isLoading: isPopularLoading } = useQuery({
    queryKey: ["popularMovies"],
    queryFn: fetchPopularMovie,
    onSuccess: (data) => {
      SetPopular(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Popular Movies", error);
    },
  });

  const { isLoading: isUpcomingLoading } = useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: fetchUpComingMovie,
    onSuccess: (data) => {
      SetUpcoming(data.results);
    },
    onError: (error) => {
      console.log("Error fetching Popular Movies", error);
    },
  });

  const { isLoading: isGenresLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    onSuccess: (data) => {
      SetGenres(data.genres);
    },
    onError: (error) => {
      console.log("Error fetching Genre", error);
    },
  });

  return (
    <ImageBackground
      source={require("../../assets/images/homescreen1.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay to darken/lighten the background */}
      <View style={[styles.overlay, darkMode && styles.darkOverlay]} />
      <ScrollView style={styles.container}>
        <StatusBar style={darkMode ? "light" : "dark"} />

        {/* Welcome Title */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/images/avatar.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          {/* Notification and Search Icon */}
          <View style={styles.iconContainer}>
            <BellIcon size={30} strokeWidth={2} color={darkMode ? "white" : "black"} />
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <MagnifyingGlassIcon size={30} strokeWidth={2} color={darkMode ? "white" : "black"} />
            </TouchableOpacity>
          </View>
        </View>

        {isTrendingLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            {/* Trending Movies */}
            {trending?.length > 0 && <TrendingMovies data={trending} />}

            {/* Popular Movies */}
            {popular?.length > 0 && (
              <PopularMovie title="Popular" data={popular} textStyle={darkMode ? styles.darkText : styles.lightText} />
            )}

            {/* Top Rated Movies */}
            {topRated?.length > 0 && (
              <TopRatedMovies genre={genre} title="Top Rated" data={topRated} textStyle={darkMode ? styles.darkText : styles.lightText} />
            )}

            {/* Upcoming Movies */}
            {upcoming?.length > 0 && (
              <UpcomingMovie title="Upcoming" data={upcoming} textStyle={darkMode ? styles.darkText : styles.lightText} />
            )}
          </ScrollView>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Light mode semi-transparent overlay
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark mode semi-transparent overlay
  },
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 22.5,
    overflow: "hidden",
  },
  avatar: {
    width: 45,
    height: 45,
  },
  iconContainer: {
    flexDirection: "row",
    spaceX: 16,
  },
  lightText: {
    color: "#000",
  },
  darkText: {
    color: "#fff",
  },
});
