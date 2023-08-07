import { StyleSheet, View, Text, Button } from "react-native";
import RandomNumber from "./RandomNumber";
import { useState, useEffect, useRef } from "react";
import shuffle from "lodash.shuffle";
import ConfettiCannon from "react-native-confetti-cannon";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function Game({
  randomNumberCount,
  initialSeconds,
  onPlayAgain,
}) {
  const [randomNumbers] = useState(
    Array.from({ length: randomNumberCount }).map(
      () => 1 + Math.floor(10 * Math.random())
    )
  );
  const [shuffledNumbers] = useState(shuffle(randomNumbers));
  const [target] = useState(
    randomNumbers
      .slice(0, randomNumberCount - 2)
      .reduce((acc, cur) => acc + cur, 0)
  );
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [status, setStatus] = useState("PLAYING");
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [timerId, setTimerId] = useState();
  const confettiRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(0);

  const isNumberSelected = (index) => {
    return selectedNumbers.indexOf(index) >= 0;
  };

  const loadScore = async () => {
    try {
      const scoreString = await AsyncStorage.getItem("score");
      const highscore = await AsyncStorage.getItem("highscore");
      if (scoreString !== null) {
        const savedScore = JSON.parse(scoreString);
        setScore(savedScore);
        setHighscore(JSON.parse(highscore));
      } else {
        setScore(0); // If score is not found in AsyncStorage, set it to 0
        setHighscore(0);
      }
    } catch (error) {
      // Error retrieving data
      console.error("Error loading score:", error);
    }
  };

  const increaseScore = async () => {
    const newScore = score + 1;
    setScore(newScore); // Update the state with the new score
    try {
      await AsyncStorage.setItem("score", JSON.stringify(newScore)); // Save the new score to AsyncStorage
      const highscore = await AsyncStorage.getItem("highscore");
      if (newScore > (highscore ? highscore : 0)) {
        setHighscore(newScore);
        await AsyncStorage.setItem("highscore", JSON.stringify(newScore));
      }
    } catch (error) {
      // Error saving data
      console.error("Error saving score:", error);
    }
  };

  useEffect(() => {
    loadScore();
    if (remainingSeconds > 0) {
      const id = setInterval(() => {
        setRemainingSeconds(remainingSeconds - 1);
      }, 1000);

      setTimerId(id);

      return () => {
        clearInterval(timerId);
      };
    } else {
      setStatus("LOST");
    }
  }, [remainingSeconds, setStatus, setTimerId]);

  const selectNumber = (index) => {
    setSelectedNumbers([...selectedNumbers, index]);
    gameStatus([...selectedNumbers, index]);
  };

  const gameStatus = async (numbers) => {
    const sumSelected = numbers.reduce((acc, cur) => {
      return acc + shuffledNumbers[cur];
    }, 0);

    if (sumSelected < target) {
      setStatus("PLAYING");
      return;
    } else if (sumSelected === target) {
      confettiRef.current.start();
      setStatus("WON");
      increaseScore();
      clearInterval(timerId);
      return;
    } else {
      setStatus("LOST");
      clearInterval(timerId);
      return;
    }
  };

  const resetScore = async() =>{
    await AsyncStorage.clear()
    onPlayAgain()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{remainingSeconds}:00s</Text>
      <Text style={[styles.target, styles[`STATUS_${status}`]]}>{target}</Text>
      <View style={styles.randomNumbers}>
        {shuffledNumbers.map((randomNumber, i) => (
          <RandomNumber
            key={i}
            id={i}
            number={randomNumber}
            isSelected={isNumberSelected(i) || status !== "PLAYING"}
            onPress={selectNumber}
          />
        ))}
      </View>

      {status !== "PLAYING" && (
        <Button
          style={styles.playagain}
          title={"Play Again"}
          onPress={onPlayAgain}
        />
      )}
      <View style={styles.score}>
        <View>
          <Text>Your Score</Text>
          <Text style={styles.scorevalue}>{score}</Text>
        </View>

        <View>
          <Text>High Score</Text>
          <Text style={styles.scorevalue}>{highscore}</Text>
        </View>
      </View>

      <Button title={"Reset Game"} onPress={()=>resetScore()}/>
      <ConfettiCannon
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        ref={confettiRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  target: {
    fontSize: 40,
    backgroundColor: "#d2edff",
    marginHorizontal: 50,
    textAlign: "center",
    paddingVertical: 20,
    fontWeight: 600,
    color: "#007bff",
    borderRadius: 10,
  },

  randomNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 50,
  },

  buttonContainer: {
    width: "30%", // 3 buttons on a row (adjust as needed based on your design)
    marginVertical: 10,
    marginHorizonta: 2,
    color: "white",
    fontSize: 20,
  },
  number: {
    backgroundColor: "#007bff",
    paddingVertical: 90,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    height: 3,
  },

  STATUS_WON: {
    backgroundColor: "green",
    color: "white",
  },
  STATUS_LOST: {
    backgroundColor: "red",
    color: "white",
  },

  timer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "red",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    marginVertical: 20,
    flex: 0,
    width: 60,
    marginHorizontal: "auto",
  },

  playagain: {
    color: "#007bff",
    backgroundColor: "white",
  },

  score: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    borderRadius: 5,
  },

  scorevalue: {
    fontSize: 30,
    fontWeight: 600,
    textAlign: "center",
  },
});
