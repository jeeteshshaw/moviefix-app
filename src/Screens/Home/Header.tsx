import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import styles from './styles';
import { MoviesListProps, searchWithCancelToken } from './search';

interface MovieGenreStateType {
    id: string | number;
    name: string;
}

/**
 * This function is used to fetch the list of movie genres from themoviedb API.
 *
 * @returns {Promise<import('axios').AxiosResponse<import('axios').AxiosResponse<any>>>}
 * A promise that resolves to the axios response containing the list of genres.
 *
 * @throws Will throw an error if the request fails or times out.
 *
 * @remarks
 * The function uses the axios library to make a GET request to themoviedb API.
 * The API key is included in the request URL.
 * The function does not take any parameters.
 * The response is expected to be in the format specified by themoviedb API.
 *

 */
const getGenreList = async () => {
    return axios.get("https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d")
}
interface HeaderStateType {
    updateGenreData: (id: string) => void;
    selected: number;
    onCardPress: Function;

}




const Header: React.FC<HeaderStateType> = (props) => {
    const [genres, setGenres] = useState<Array<MovieGenreStateType>>([]);
    const [searchedMovies, setSearchedMovies] = useState<Array<MoviesListProps>>([]);

    /**
 * This effect hook fetches the list of movie genres from themoviedb API when the component mounts.
 * It uses the `getGenreList` function to make the API request.
 * The fetched genres are stored in the `genres` state variable.
 *
 * @remarks
 * The `getGenreList` function is assumed to be defined elsewhere in the codebase.
 * The `setGenres` function is a part of the React useState hook and is used to update the `genres` state variable.
 *
 
 */
    useEffect(() => {
        getGenreList().then((res) => {
            setGenres(res.data.genres)
        }
        )
    }, [])

    return (
        <View style={styles.headerContainer}>
            {/* logo */}
            <SafeAreaView>
                <Text style={styles.logoText}>MOVIEFIX</Text>
            </SafeAreaView>

            {/* search option */}
            <View style={{ position: "relative", zIndex: 10, width: "90%", alignSelf: "center" }}>
                <View style={{ width: "100%", backgroundColor: "black", borderRadius: 30 }}>
                    <TextInput placeholder='search movie' placeholderTextColor={"#eee"} style={{ color: "#fff", height:50, paddingHorizontal:10 }} onChangeText={async (e) => {
                        const res = await searchWithCancelToken(e);
                        setSearchedMovies(res.slice(0, 5))
                    }
                    } />
                </View>
                {/* search result list */}
                {searchedMovies.length>0 && <View style={styles.searchList}>
                    {
                        searchedMovies.map((item) => {
                            return (
                                <Text key={item.id} style={[styles.genreText, { backgroundColor: "rgba(0,0,0,.4)", width: "100%" }]} onPress={() => props.onCardPress(true, item)}>{item.name}</Text>
                            )
                        })
                    }
                </View>}
            </View>

            {/* Genre list display */}
            <View style={{ paddingVertical: 16, }}>

                <FlatList

                    horizontal
                    data={[{ id: -1, name: "All" }, ...genres]}
                    keyExtractor={(item) => item.id + item.name}

                    showsHorizontalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                    ListHeaderComponent={() => <View style={{ width: 20 }} />}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => props.updateGenreData(+item.id > 0 ? item.id.toString() : "")} style={{ backgroundColor: props.selected == item.id ? "#f0283c" : "#424242", padding: 10, borderRadius: 5 }}>
                            <Text style={styles.genreText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}

export default Header
