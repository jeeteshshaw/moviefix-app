import { FlatList, FlatListProps, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import MovieCard from '../MovieCard/MovieCard.component'
import MovieType from '../../Constants/Types/Movie.type';


interface MovieListProps extends Omit<FlatListProps<MovieType>, 'renderItem'> {
    title: string | number;
    cardWidth: number;
    cardHeight: number;
    renderItem?: ({ item, index }: { item: MovieType; index: number }) => React.ReactNode;
    // Add additional props specific to your component here
    contentContainerStyle?: ViewStyle;
    onCardPress:Function
}
const MovieCollectionDisplayComponent:React.FC<MovieListProps> = (props) => {
  return (
    <View>
      <FlatList
       {...props || {}}
        data={props.data}
        numColumns={2}
        initialNumToRender={8}
        columnWrapperStyle={{justifyContent:"space-evenly"}}
        contentContainerStyle={{marginHorizontal:8, }}
        ListHeaderComponent={()=><View style={styles.listTitle}><Text style={styles.listTitleText}>{props.title}</Text></View>}
        ItemSeparatorComponent={()=> <View style={{height:16}}/>}
        renderItem={({item, index})=>(
            <TouchableOpacity onPress={()=>props.onCardPress(true,item)} >
                <MovieCard width={props.cardWidth} height={props.cardHeight} item={item} index={index} />
            </TouchableOpacity>
        )}
        />
    </View>
  )
}

export default MovieCollectionDisplayComponent

const styles = StyleSheet.create({
    listTitle:{marginTop:20, marginBottom:10},
    listTitleText:{color:"#fff", fontSize:20, fontWeight:"600"}
})



