import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#121212", flex: 1 
    },
    instructionsText: {color:"#fff", textAlign:"center", marginTop:10},
    headerContainer:{ backgroundColor: "#242424", width: "100%",zIndex:1 },
    logoText:{ color: "red", fontSize: 28, fontWeight: "600", padding: 10, marginHorizontal: 10 },
    genreText:{ color: "#f5f5f5", fontSize: 16 },
    searchList:{ position: "absolute", width: "100%", top: 30, padding: 10, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 10 }
})

export default styles;