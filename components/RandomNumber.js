import { View,  StyleSheet,Text } from "react-native";

export default function RandomNumber({ number, isSelected, onPress,id }) {
  const handlePress = () => {
    if(isSelected){
      return
    }
    onPress(id);
  };

  return (
    <View style={styles.buttonContainer}>
      <Text
        onPress={handlePress}
        style={[styles.number, isSelected ? styles.active : ""]}
      >
        <Text style={styles.digit}>{number}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    textAlign:"center"
  },


  digit:{
    color:"white",
    fontFamily: 'System',
    fontWeight:"bold"
  },

  active: {
    backgroundColor: "#d2edff",
  },
});
