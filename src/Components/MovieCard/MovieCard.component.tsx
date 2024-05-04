import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MovieType from '../../Constants/Types/Movie.type';



interface MovieCardProps {
  item?: MovieType;
  width?: number;
  height?: number;
  index?: number;
}


const MovieCard:  React.FC<MovieCardProps> = (props) => {
  return (
    <View  style={[styles.container,{ width:props?.width, height:props?.height, }]}>
    <Image source={{uri:"https://image.tmdb.org/t/p/w500/"+props.item?.poster_path}} style={styles.image} />
      <View style={styles.infoContainer}>
          <Text style={styles.title}>{props.item?.original_title}</Text>
          <Text style={styles.rating}>{props.item?.vote_average.toFixed(2)}</Text>
      </View>
    </View>
  )
}

export default MovieCard

const styles = StyleSheet.create({
  container:{position:"relative"},
  image:{
    resizeMode:"cover",
    flex:1
  },
  infoContainer:{
    position:"absolute",
    bottom:20,
    left:10
  },
  title:{
    color:"#fff",
    fontSize:16,
    fontWeight:"500"
  },
  rating:{
    color:"#fff",
    fontSize:12
  }
})