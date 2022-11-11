import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { colors, CLEAR, ENTER, colorsToEmoji } from "./src/constants";
import Keyboard from "./src/components/Keyboard";
import * as Clipboard from "expo-clipboard";

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
}

const dayOfTheYear = getDayOfTheYear();

export default function App() {
  const word = words[dayOfTheYear];
  const letters = word.split("");

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState("playing"); // won, lost, playing
    

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
    console.log(words[365]);
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== "won") {
      Alert.alert("Hurray", "You won!", [{text: "Share", onPress: shareScore}]);
      setGameState("won");
    } else if (checkIfLost() && gameState !== "lost") {
      Alert.alert("Meh", "Try again tomorrow!");
      setGameState("lost");
    }
  }

  const shareScore = () => {
    const textMap = rows.map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")).filter(row => row).join("\n");
    const textToShare = `Wordle \n\n${textMap}`;
    Clipboard.setString(textToShare);
    Alert.alert("Copied Successfully!", "Share your score on your social media");
  }

  const checkIfWon = () => {
    const row = rows[curRow - 1];

    return row.every((letter, i) => letter === letters[i]);
   }

  const checkIfLost = () => {    
    return !checkIfWon() && curRow === NUMBER_OF_TRIES;
  }
  

  const onKeyPressed = (key) => {
    if (gameState !== "playing") {
      return;
    }
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = "";
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }

      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];

    if (row >= curRow) {
      return colors.black;
    }
    if (letter  === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  const getAllLettersWithColor = (color) => {
      return rows.flatMap((row, i) => row.filter((cell, j) => getCellBGColor(i, j) === color));
  }

  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>WORDLE</Text>

      <ScrollView style={styles.map}>
        {rows.map((row, i) => (
          <View style={styles.row} key={`row-${i}`}>
            {row.map((cell, j) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(i, j)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(i, j),
                  },
                ]}
                key={`cell-${i}-${j}`}
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 7,
    borderBottomColor: colors.lightgrey,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  map: {
    alignSelf: "stretch",
    height: 100,
    marginVertical: 20,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  cell: {
    borderWidth: 3,
    borderColor: colors.darkgrey,
    flex: 1,
    maxWidth: 70,
    aspectRatio: 1,
    margin: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: "bold",
    fontSize: 28,
  },
});

const words = [
  "which",
  "there",
  "their",
  "about",
  "would",
  "these",
  "other",
  "words",
  "could",
  "write",
  "first",
  "water",
  "after",
  "where",
  "right",
  "think",
  "three",
  "years",
  "place",
  "sound",
  "great",
  "again",
  "still",
  "every",
  "small",
  "found",
  "those",
  "never",
  "under",
  "might",
  "while",
  "house",
  "world",
  "below",
  "asked",
  "going",
  "large",
  "until",
  "along",
  "shall",
  "being",
  "often",
  "earth",
  "began",
  "since",
  "study",
  "night",
  "light",
  "above",
  "paper",
  "parts",
  "young",
  "story",
  "point",
  "times",
  "heard",
  "whole",
  "white",
  "given",
  "means",
  "music",
  "miles",
  "thing",
  "today",
  "later",
  "using",
  "money",
  "lines",
  "order",
  "group",
  "among",
  "learn",
  "known",
  "space",
  "table",
  "early",
  "trees",
  "short",
  "hands",
  "state",
  "black",
  "shown",
  "stood",
  "front",
  "voice",
  "kinds",
  "makes",
  "comes",
  "close",
  "power",
  "lived",
  "vowel",
  "taken",
  "built",
  "heart",
  "ready",
  "quite",
  "class",
  "bring",
  "round",
  "horse",
  "shows",
  "piece",
  "green",
  "stand",
  "birds",
  "start",
  "river",
  "tried",
  "least",
  "field",
  "whose",
  "girls",
  "leave",
  "added",
  "color",
  "third",
  "hours",
  "moved",
  "plant",
  "doing",
  "names",
  "forms",
  "heavy",
  "ideas",
  "cried",
  "check",
  "floor",
  "begin",
  "woman",
  "alone",
  "plane",
  "spell",
  "watch",
  "carry",
  "wrote",
  "clear",
  "named",
  "books",
  "child",
  "glass",
  "human",
  "takes",
  "party",
  "build",
  "seems",
  "blood",
  "sides",
  "seven",
  "mouth",
  "solve",
  "north",
  "value",
  "death",
  "maybe",
  "happy",
  "tells",
  "gives",
  "looks",
  "shape",
  "lives",
  "steps",
  "areas",
  "sense",
  "speak",
  "force",
  "ocean",
  "speed",
  "women",
  "metal",
  "south",
  "grass",
  "scale",
  "cells",
  "lower",
  "sleep",
  "wrong",
  "pages",
  "ships",
  "needs",
  "rocks",
  "eight",
  "major",
  "level",
  "total",
  "ahead",
  "reach",
  "stars",
  "store",
  "sight",
  "terms",
  "catch",
  "works",
  "board",
  "cover",
  "songs",
  "equal",
  "stone",
  "waves",
  "guess",
  "dance",
  "spoke",
  "break",
  "cause",
  "radio",
  "weeks",
  "lands",
  "basic",
  "liked",
  "trade",
  "fresh",
  "final",
  "fight",
  "meant",
  "drive",
  "spent",
  "local",
  "waxes",
  "knows",
  "train",
  "bread",
  "homes",
  "teeth",
  "coast",
  "thick",
  "brown",
  "clean",
  "quiet",
  "sugar",
  "facts",
  "steel",
  "forth",
  "rules",
  "notes",
  "units",
  "peace",
  "month",
  "verbs",
  "seeds",
  "helps",
  "sharp",
  "visit",
  "woods",
  "chief",
  "walls",
  "cross",
  "wings",
  "grown",
  "cases",
  "foods",
  "crops",
  "fruit",
  "stick",
  "wants",
  "stage",
  "sheep",
  "nouns",
  "plain",
  "drink",
  "bones",
  "apart",
  "turns",
  "moves",
  "touch",
  "angle",
  "based",
  "range",
  "marks",
  "tired",
  "older",
  "farms",
  "spend",
  "shoes",
  "goods",
  "chair",
  "twice",
  "cents",
  "empty",
  "alike",
  "style",
  "broke",
  "pairs",
  "count",
  "enjoy",
  "score",
  "shore",
  "roots",
  "paint",
  "heads",
  "shook",
  "serve",
  "angry",
  "crowd",
  "wheel",
  "quick",
  "dress",
  "share",
  "alive",
  "noise",
  "solid",
  "cloth",
  "signs",
  "hills",
  "types",
  "drawn",
  "worth",
  "truck",
  "piano",
  "upper",
  "loved",
  "usual",
  "faces",
  "drove",
  "cabin",
  "boats",
  "towns",
  "proud",
  "court",
  "model",
  "prime",
  "fifty",
  "plans",
  "yards",
  "prove",
  "tools",
  "price",
  "sheet",
  "smell",
  "boxes",
  "raise",
  "match",
  "truth",
  "roads",
  "threw",
  "enemy",
  "lunch",
  "chart",
  "scene",
  "graph",
  "doubt",
  "guide",
  "winds",
  "block",
  "grain",
  "smoke",
  "mixed",
  "games",
  "wagon",
  "sweet",
  "topic",
  "extra",
  "plate",
  "title",
  "knife",
  "fence",
  "falls",
  "cloud",
  "wheat",
  "plays",
  "enter",
  "broad",
  "steam",
  "atoms",
  "press",
  "lying",
  "basis",
];
