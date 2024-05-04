import { TextProps } from "react-native";

interface movieDetailsShowKeysDataType {
    name: string;
    label: string;
    style?: TextProps
}

const movieDetailsShowKeys:movieDetailsShowKeysDataType[] = [
    {
        name:"title",
        label: "Title",
        
        
    },
    // {
    //     name:"Genres",
    //     label: "genres",
        
        
    // },
    {
        name:"Overview",
        label: "overview",
    }
]

export default movieDetailsShowKeys;