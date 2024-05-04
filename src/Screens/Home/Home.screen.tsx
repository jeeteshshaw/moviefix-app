import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import MovieCollectionDisplayComponent from '../../Components/MovieCollectionDisplay/MovieCollectionDisplay.component';
import usePagination, { MovieStateType } from '../../Hooks/usePagination.hook';
import Header from './Header';
import styles from './styles';
import MovieDetails from './Popup/MovieDetails.modal';
import MovieType from '../../Constants/Types/Movie.type';



const defaultYears = {
    previousYear: 2012,
    nextYear: 2012,
    defaultYear: 2012,
    genres: ""
}

enum YearsTypes { "previousYear", "nextYear", "defaultYear" }

const CardWidth = (Dimensions.get("screen").width / 2) - 16
const CardHeight = 300

const HomeScreen = () => {
    const [yearsManager, setYearsManager] = React.useState({ ...defaultYears })
    const mainFlatlist = useRef<FlatList>(null)
    const { filteredMovies, updateGenre, getMoreMovies } = usePagination({ genre: yearsManager.genres }, yearsManager.defaultYear)
    const [isLoading, setIsLoading] = useState(false)
    const [showMovieDetailsPopup, setShowMovieDetailsPopup] = useState<{ show: boolean; movie: null | MovieType }>({
        show: false,
        movie: null
    });


    /**
 * This function updates the genre data and triggers a movie list update.
 * It also scrolls the main flatlist to the top.
 *
 * @param newGenre - The new genre to update the movie list.
 * @returns {void}
 */
    const updateGenreData = (newGenre: string): void => {
        // Update the yearsManager state with the new genre and reset other properties
        setYearsManager({
            ...defaultYears,
            genres: newGenre
        })

        // Trigger a movie list update based on the new genre
        updateGenre(newGenre)

        // Scroll the main flatlist to the top
        mainFlatlist.current?.scrollToOffset({
            offset: 0,
            animated: false
        })
    }

    /**
 * This function is a callback for showing or hiding the movie details popup.
 * It updates the state of the showMovieDetailsPopup to control the visibility of the popup.
 *
 * @param show - A boolean indicating whether to show or hide the popup.
 * @param movie - The movie object to display in the popup. If null, the popup will be hidden.
 * @returns {void}
 */
    const moviewDetailsShow = useCallback((show: boolean, movie: MovieType | null) => {
        setShowMovieDetailsPopup({
            show: show,
            movie: movie
        })
    }, [])


    /**
 * This function is responsible for updating the movie list based on the new year and type.
 * It handles both loading more movies and scrolling to the previous year's position.
 *
 * @param newYear - The new year to update the movie list.
 * @param type - The type of update (next year or previous year).
 * @returns {Promise<void>}
 */
    const _update = async (newYear: number, type: YearsTypes) => {

        // Check if the component is already loading movies
        if (isLoading)
            return

        // Set loading state to true
        setIsLoading(true)

        // Create a copy of the current yearsManager state
        const temp = { ...yearsManager }
        let previousYear = false

        // Update the new year based on the type
        if (type === YearsTypes.nextYear) {
            temp.nextYear = newYear
        }
        else {
            temp.previousYear = newYear
            previousYear = true
        }

        // Update the yearsManager state with the new year
        setYearsManager(temp)

        // Fetch more movies based on the new year and type
        await getMoreMovies(newYear, previousYear)

        // Wait for 100ms before scrolling to the previous year's position
        setTimeout(() => {
            if (previousYear) {
                // Scroll to the previous year's position in the flatlist
                mainFlatlist.current?.scrollToOffset({
                    offset: (300 * 10) + 100,
                    animated: false,
                })
            }

            // Set loading state to false
            setIsLoading(false)
        }, 100);
    }


    // while loading movies list 
    if (filteredMovies.length === 0)
        return <View style={styles.container}><ActivityIndicator /></View>

    return (
        <View style={styles.container}>
            {/* header code */}
            <Header updateGenreData={updateGenreData} selected={+yearsManager.genres || -1} onCardPress={moviewDetailsShow} />
            {/* main listing */}
            <FlatList
                data={filteredMovies}
                ref={mainFlatlist}
                ListHeaderComponent={() => <View><Text style={styles.instructionsText}>Pull to load data of {yearsManager.previousYear - 1}</Text></View>}
                ListFooterComponent={() => <View><Text style={styles.instructionsText}>Scroll Down to load data of {yearsManager.nextYear + 1}</Text></View>}
                onEndReachedThreshold={1}
                nestedScrollEnabled
                contentContainerStyle={{ flexGrow: 1 }}
                refreshing={isLoading}
                onRefresh={() => _update(yearsManager.previousYear - 1, YearsTypes.previousYear)}
                // onStartReached={update}
                // onStartReachedThreshold={10}
                scrollEventThrottle={40}
                keyExtractor={(item) => item.year.toString()}

                onEndReached={() => _update(yearsManager.nextYear + 1, YearsTypes.nextYear)}
                renderItem={({ item }) => (
                    <MovieCollectionDisplayComponent

                        cardHeight={CardHeight} onCardPress={moviewDetailsShow} nestedScrollEnabled scrollEnabled={false} cardWidth={CardWidth} data={item.result} title={item.year} />

                )}
            />
            {/* movie detail popup */}
            <MovieDetails visible={showMovieDetailsPopup.show} movieItem={showMovieDetailsPopup.movie} onClose={() => moviewDetailsShow(false, null)} />

        </View>
    )
}

export default HomeScreen

