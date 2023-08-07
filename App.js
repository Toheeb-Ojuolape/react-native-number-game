import React, { useState } from "react";
import Game from "./components/Game"
import { View,StyleSheet} from "react-native";


export default function App(){
    const [gameId,setGameId] = useState(1)

    const resetGame = () =>{
        setGameId(gameId+1)
    }
    return (
        <View style={styles.container}>
        <Game key={gameId} randomNumberCount={6} initialSeconds={20} onPlayAgain={resetGame}/>
        </View>
    )
}



const styles = StyleSheet.create({
    container:{
        marginTop:40,
        flex:1
    }
})