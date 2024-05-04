import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import movieDetailsShowKeys from './static'
import axios from 'axios'
import { MovieStateType } from '../../../Hooks/usePagination.hook'
import MovieData from '../../../Constants/Types/MovideData.type'
import MovieType from '../../../Constants/Types/Movie.type'


interface MovieDetailsProps {
    movieItem: MovieType | null;
    visible: boolean;
    onClose: Function;
}
type Person = {name:string, job?:string}
interface MovieDetailsStateType {
    details: MovieData| null; 
    cast: Person[];
    crew: Person[]
}
const getMovieDetailsService = ( movieId: number) => {
    return axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=2dca580c2a14b55200e784d157207b4d`)
}
const getMovieCastService = ( movieId: number) => {
    return axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=2dca580c2a14b55200e784d157207b4d`)
}

  
const MovieDetails:React.FC<MovieDetailsProps> = (props) => {
    const [movieDetails, setMovieDetails] = useState<MovieDetailsStateType>({
        details:null,
        cast:[],
        crew:[]
    })
    const _getMovieDetails = (id:number)=>{
        getMovieDetailsService(id).then((res) => {
            setMovieDetails(pre=> ({
                ...pre,
                details:res.data,
                
            }))
        })
    }
    const _getMovieCast = (id:number)=>{
        getMovieCastService(id).then((res) => {
            setMovieDetails(pre=> ({
                ...pre,
                cast:res.data.cast.slice(0,10),
                crew:res.data.crew.filter((item: Person)=> item.job ==="Director"),
                
            }))
        })
    }
    useEffect(() => {
        // write the movie details call
        if(props.visible && props.movieItem?.id){
            _getMovieDetails(props.movieItem?.id)
            _getMovieCast(props.movieItem?.id)
        }
        
    },[props.movieItem])

  return (
    <Modal transparent visible={props.visible}>
       { (movieDetails.details !==null && movieDetails.details.id === props.movieItem?.id)&& <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{uri:"https://image.tmdb.org/t/p/w500/"+movieDetails.details?.poster_path}} style={{flex:1, resizeMode:"cover"}} />

            </View>
            <ScrollView contentContainerStyle={{flexGrow:1}}>
            <View>
                        

                    <Text style={styles.infoText}>Title: {movieDetails.details.title}</Text>
                    <Text style={styles.infoText}>Overview: {movieDetails.details.overview}</Text>
                    <Text style={styles.infoText}>Genres: {movieDetails.details.genres.map((item)=>item.name).join(", ")}</Text>
                    <Text style={styles.infoText}>Director: {movieDetails.crew.map((item)=>item.name).join(", ")}</Text>
                    <Text style={styles.infoText}>Cast: {movieDetails.cast.map((item)=>item.name).join(", ")}</Text>
            </View>
            <View  style={{height:100}}/>
            </ScrollView>

        </View>
            
            }
        <SafeAreaView style={{position:"absolute", right:30, top:10}}>
            <Text style={{fontWeight:"700", fontSize:30, color:"red"}} onPress={()=>props.onClose()}>X</Text>
        </SafeAreaView>
    </Modal>
  )
}

export default MovieDetails

const styles = StyleSheet.create({
    container:{backgroundColor:"rgba(0,0,0,.8)", flex:1},
    imageContainer:{width:"100%", height:400},
    infoText:{color:"#fff", textAlign:"center",fontSize:18, fontWeight:"500", marginTop:16}
})