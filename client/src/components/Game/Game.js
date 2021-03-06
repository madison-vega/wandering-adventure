import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Card from "../CharacterCard/CharacterCard";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import API from "../../utils/API";
import { Link, useParams } from "react-router-dom";
import "./game.css";

const Game = (props) => {
  const [userState, setUserState] = useState({
    attack: "",
    userID: "",
    chrName: "",
    img: "",
    bio: "",
  });
  const [compState, setCompState] = useState("");
  const [enemyState, setEnemyState] = useState({
    name: "The Island",
    health: 1,
    stamina: 100,
    mana: 100,
    bio: "Tread carefully, you dont know who will attack you",
    img: "https://i.pinimg.com/originals/55/15/8c/55158c9f1515b9f7afb257b312cc4e48.jpg",
  });
  const [displayState, setDisplayState] = useState({
    title: "",
    text: "",
  });
  const [gameState, setGameState] = useState({
    phase: "exploring",
    encounters: 0,
    seenEncounters: [],
    userHealth: 100,
    maxMovement: 7,
    currentMovement: 0,
  });

  // Array for the battle options
  const redOptions = [
    "Throw a mean right hook",
    "Start dancing like a butterfly",
    "Sting them like a Bee",
    "Bite them in the ear",
    "German Suplex",
    "Round house kick",
    "You activated my trap card!"
  ];
  const blueOptions = [
    "I wave my Turkey leg in the air",
    "Shadow Clone Jutsu!",
    "Rasengan!",
    "I choose you Pickahu, lightning bolt",
    "Expecto Patronum!",
    "I summon Baby Dragon!"
  ];
  const greenOptions = [
    "Dodge and strike",
    "Sneak in close and snapped in their ear",
    "Drop a smoke bomb",
    "Run at them naked",
    "Throw shuriken at their feet",
    "Ultra Instinct",
    "Kamehameha!",
    "Wingardium Leviosa!"
  ];

  // Arrays for directions
  const rightText = [
    "You go right, and walk over a dead body",
    "You walk past by a creepy pitch black cave, you can feel a dark aura from it",
    "You find a tree fallen over after a storm, you crawl under it",
    "You stumbled open large steps, once you're on top, you slip and fall down",
    "You're walking along the road and you see a volcano erupt"
  ];
  const forwardText = [
    "You walk by two old men playing chess on the side of road",
    "You find a raging river, you build a raft and sail down the river",
    "You look ahead and see the most beautiful sight",
    "You trip over a stone, you  look at it and it says 'Goodluck'",
    "You get lost in thought and your foot falls through  the ground. You take a closer look and you catch a whiff of death. You keep moving."
  ];
  const leftText = [
    "You walk by a merchant, selling clothes. They yell to get your attention, you keep looking forward",
    "You cross paths with an odd looking traveler with a staff, you steady your hand ready for attack. They give you a nod and keep moving",
    "You take a breath, as you sit you see a bear cub playing with their mother through the brush",
    "As you're eating dinner, you hear a noise. You grab your weapon.... you're blinded by light and see beautiful stag",
    "You gradually start to get cold, you see a heard of buffalo pass you by. They run around you, you stand in place"
  ];

  // Material UI Styling
  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
    },
    text: {
      color: "white",
    }
  }));

  const classes = useStyles();

  // Handles the clicks for exploring
  const exploringClick = (display) => {
    setDisplayState({ ...displayState, text: display });
    setGameState({
      ...gameState,
      currentMovement: gameState.currentMovement + 1,
    });
  };

  // Handles click for the confirmation button/ Set up encounter
  const confirmClick = async () => {
    let flag = true;
    let event;

    do {
      event = await API.getRandomEvent();

      if (!gameState.seenEncounters.includes(event.id)) {
        flag = false;
      }
    } while (flag);

    gameState.seenEncounters.push(event.data.id);
    setDisplayState({
      ...displayState,
      text: event.data.text,
      title: event.data.title,
    });
    setEnemyState({
      ...enemyState,
      name: event.data.npc.name,
      health: event.data.npc.health,
      bio: event.data.npc.bio,
      img: event.data.imageUrl,
    });
    if (event.data.type === "Combat") {
      setGameState({ ...gameState, phase: "encounter" });
    } else if (event.data.type === "Noncombat") {
      setGameState({ ...gameState, phase: "NPC" });
    }
  };

  // Restarts the game
  const restartGame = () => {
    setGameState({
      ...gameState,
      phase: "exploring",
      userHealth: 100,
      currentMovement: 0,
      encounters: 0,
    });
    setDisplayState({
      ...displayState,
      text: "You awake from your sleep, all of your memories come rushing back to you, you know what you must do...",
      title: "",
    });
    setEnemyState({
      ...enemyState,
      name: "The Island",
      health: 1,
      stamina: 100,
      mana: 100,
      bio: "Tread carefully, you dont know who will attack you",
      img: "https://i.pinimg.com/originals/55/15/8c/55158c9f1515b9f7afb257b312cc4e48.jpg",
    });
  };

  // This for the non Combat events
  const npcEvent = () => {
    setDisplayState({
      ...displayState,
      text: "You continue down your path",
      title: "",
    });
    setGameState({
      ...gameState,
      phase: "exploring",
      userHealth: gameState.userHealth + 10,
      maxMovement:
        gameState.currentMovement + Math.floor(Math.random() * 10) + 3,
    });
    setEnemyState({
      ...enemyState,
      health: 1,
      bio: "Keep eyes in the back of your head",
      name: "The Island",
      img: "https://i.pinimg.com/originals/55/15/8c/55158c9f1515b9f7afb257b312cc4e48.jpg",
    });
  };

  // The battle between Comp and User
  const battle = () => {
    const choices = ["rock", "paper", "scissors"];

    setCompState(choices[Math.floor(Math.random() * 3)]);

    if (userState.attack === "rock" && compState === "scissors") {
      setDisplayState({
        ...displayState,
        text: "You drew blood!",
        enemyEffect: "-10",
      });
      setEnemyState({ ...enemyState, health: enemyState.health - 10 });
    } else if (userState.attack === "rock" && compState === "paper") {
      setDisplayState({
        ...displayState,
        text: "Your Enemy was to fast for you and struck you",
        userEffect: "-5",
      });
      setGameState({ ...gameState, userHealth: gameState.userHealth - 5 });
    } else if (userState.attack === "scissors" && compState === "paper") {
      setDisplayState({
        ...displayState,
        text: "You outsmarted your Enemy",
        enemyEffect: "-10",
      });
      setEnemyState({ ...enemyState, health: enemyState.health - 10 });
    } else if (userState.attack === "scissors" && compState === "rock") {
      setDisplayState({
        ...displayState,
        text: "Your were to slow this time",
        userEffect: "-5",
      });
      setGameState({ ...gameState, userHealth: gameState.userHealth - 5 });
    } else if (userState.attack === "paper" && compState === "rock") {
      setDisplayState({
        ...displayState,
        text: "You hit the Enemy",
        enemyEffect: "-10",
      });
      setEnemyState({ ...enemyState, health: enemyState.health - 10 });
    } else if (userState.attack === "paper" && compState === "scissors") {
      setDisplayState({
        ...displayState,
        text: "You've been hit",
        userEffect: "-5",
      });
      setGameState({ ...gameState, userHealth: gameState.userHealth - 5 });
    } else {
      setDisplayState({
        ...displayState,
        text: "Battle was fierce but you each held your own",
      });
    }
  };

  const { gameId, userId, charId } = useParams()
  // Start of the game
  useEffect(() => {
    API.getCharacter(userId, charId).then((res) => {
      if (res.data.class === "Mage") {
        setUserState({
          ...userState,
          chrName: res.data.name,
          health: res.data.health,
          img: "https://live.staticflickr.com/65535/51296892783_ff5dc2707f_w.jpg",
          bio: "A cunning mage, setting out on their first quest out of their apprenticeship.",
        });
      }
      if (res.data.class === "Warrior") {
        setUserState({
          ...userState,
          chrName: res.data.name,
          health: res.data.health,
          img: "https://live.staticflickr.com/65535/51297013113_71c5d66e7d_w.jpg",
          bio: "A fierce swordsman on a quest to become the greatest knight.",
        });
      }
      
      setGameState({
        ...gameState,
        encounters: res.data.game.event_count,
        phase: "exploring",
      });
    });
    API.getSeenEvents(2).then((res) => {
      res.data.map((event) => {
        gameState.seenEncounters.push(event.id);
        return;
      });
    });
    setDisplayState({
      ...displayState,
      text: 'You suddenly appear on an island, you cant remember anything. You hear a voice in your head saying 3 enemys will attack you. You can feel this to be true in your bones. You decide that forward is the way out...',
      title: "Who are you?"
    });
  }, [charId]);

  
  // Helps with battle
  useEffect(() => {
    if (userState.attack === "") return;
    battle(userState.attack);
    setUserState({ ...userState, attack: "" });
  }, [userState.attack]);

  // Character Obj for the save
  const chr = {
    health: gameState.userHealth,
    id: charId,
    game: {
      id: gameId,
    },
    mana: 100,
    stamina: 10,
  };
  
  // Health check
  useEffect(() => {
    if (gameState.userHealth <= 0) {
      setDisplayState({
        ...displayState,
        text: "You've been defeated! Better luck next time!",
      });
      setGameState({ ...gameState, phase: "end" });
    } else if (enemyState.health <= 0) {
      setDisplayState({
        ...displayState,
        text: "You defeated your Enemy! What direction do you want to go?",
        title: "",
      });
      setGameState({
        ...gameState,
        encounters: gameState.encounters + 1,
        phase: "exploring",
        maxMovement:
        gameState.currentMovement + Math.floor(Math.random() * 10) + 3,
      });
      setEnemyState({
        ...enemyState,
        health: 100,
        name: "The Island",
        bio: "You find that there not all enemys",
        img: "https://i.pinimg.com/originals/55/15/8c/55158c9f1515b9f7afb257b312cc4e48.jpg",
      });
      // API Call to save the current progress
      API.updateCharacter(
        userId, //userID
        chr, //character object
        gameState.seenEncounters[gameState.seenEncounters.length - 1]
        );
      }
    }, [gameState.userHealth, enemyState.health]);

    // Checks user for encounter
  useEffect(() => {
    if (gameState.currentMovement === gameState.maxMovement) {
      setGameState({ ...gameState, phase: "confirm" });
      setDisplayState({
        ...displayState,
        text: "You've stumbled on to an event!",
      });
    }
  }, [gameState.currentMovement]);
  
  
  // Boss Fight and Ending Seen
  useEffect(() => {
    //Boss Fight
    if (gameState.encounters === 4) {
      setGameState({
        ...gameState,
        phase: "encounter",
      });
      setDisplayState({
        ...displayState,
        title: "Where am I!?",
        text: "You are suddenly teleported infront of a dark Mage. You actually recognize the jewel on his staff, its the Fox Fire. It is Dragorim the Black!" ,
      });
      setEnemyState({
        ...enemyState,
        name: "Dragorim the Black",
        health: 110,
        stamina: 100,
        mana: 100,
        bio: "The most notorious mage known for human sacrificing to draw more power. He draws all his power from the Fox Fire.",
        img: "https://i.redd.it/z8juypra2ce31.jpg",
      });
    }
    //Ending Seen
    if (gameState.encounters === 5) {
      setGameState({
        ...gameState,
        phase: "end",
      });
      setDisplayState({
        ...displayState,
        title: "I need a drink",
        text: "You defeated, Dragorim! You grab and smash the Fox Fire to peaces. You are suddenly teleported outside of a tavern. All of your memories come back, you remember you were here with your companions. As you walk in you are being called to a table by your companions saying hurry up it is your turn!" ,
      });
      setEnemyState({
        ...enemyState,
        name: "The Winking Skeever",
        health: 1,
        stamina: 100,
        mana: 100,
        bio: "The regular meeting spot for your group, Rebels of Fortune.",
        img: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d297121a-919b-4f18-9163-78f08879b333/d7exfcc-8877ab0e-31c7-4be8-b5cf-2a44e2b65631.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2QyOTcxMjFhLTkxOWItNGYxOC05MTYzLTc4ZjA4ODc5YjMzM1wvZDdleGZjYy04ODc3YWIwZS0zMWM3LTRiZTgtYjVjZi0yYTQ0ZTJiNjU2MzEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.9uNrg5ItCE1-SV_LEmovKxPrpf_AOZuP9MRLxL3Yzq4",
      });
    }
  }, [gameState.encounters]);

  return (
    <Grid container>
      {/* User Card */}
      <Grid item xs={3}>
        <Card
          name={userState.chrName}
          health={gameState.userHealth}
          img={userState.img}
          bio={userState.bio}
        />
      </Grid>
      {/* Game Section */}
      <Grid item xs={6} justifycontent="space-between">
        <Grid container id="gameSub">
          <Grid item xs={12}>
            <Typography id="text" variant="h3">
              {displayState.title}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography id="text" className={classes.text} variant="h4">
              {displayState.text}
            </Typography>
          </Grid>

          <Grid item className="buttons" xs={12}>
            {/* Battle Phase */}
            {gameState.phase === "encounter" ? (
              <>
                <Box component="div" id="mainGame">
                  <div className={classes.root}></div>
                </Box>
                <Box component="div" id="container">
                  <Button
                    id="red"
                    onClick={() =>
                      setUserState({ ...userState, attack: "rock" })
                    }
                  >
                    {redOptions[Math.floor(Math.random() * redOptions.length)]}
                  </Button>
                  <Button
                    id="blue"
                    onClick={() =>
                      setUserState({ ...userState, attack: "paper" })
                    }
                  >
                    {
                      blueOptions[
                        Math.floor(Math.random() * blueOptions.length)
                      ]
                    }
                  </Button>
                  <Button
                    id="green"
                    onClick={() =>
                      setUserState({ ...userState, attack: "scissors" })
                    }
                  >
                    {
                      greenOptions[
                        Math.floor(Math.random() * greenOptions.length)
                      ]
                    }
                  </Button>
                </Box>
              </>
            ) : null}
            {gameState.phase === "exploring" ? (
              <Box component="div" id="container">
                <Button
                  id="red"
                  onClick={() =>
                    exploringClick(
                      leftText[Math.floor(Math.random() * leftText.length)]
                    )
                  }
                >
                  Left
                </Button>
                <Button
                  id="blue"
                  onClick={() =>
                    exploringClick(
                      forwardText[
                        Math.floor(Math.random() * forwardText.length)
                      ]
                    )
                  }
                >
                  Forward
                </Button>
                <Button
                  id="green"
                  onClick={() =>
                    exploringClick(
                      rightText[Math.floor(Math.random() * rightText.length)]
                    )
                  }
                >
                  Right
                </Button>
              </Box>
            ) : null}
            {gameState.phase === "confirm" ? (
              <Box component="div" id="container">
                <Button id="red" onClick={() => confirmClick()}>
                  Investigate
                </Button>
              </Box>
            ) : null}
            {gameState.phase === "NPC" ? (
              <>
                <Box component="div" id="mainGame">
                  <div className={classes.root}>
                    {/* <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Paper>{displayState.userEffect}</Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper>{displayState.enemyEffect}</Paper>
                        </Grid>
                      </Grid> */}
                  </div>
                </Box>
                <Box component="div" id="container">
                  <Button id="green" onClick={() => npcEvent()}>
                    Continue
                  </Button>
                </Box>
              </>
            ) : null}
            {gameState.phase === "end" ? (
              <Box component="div" id="container">
                <Button id="red" onClick={() => restartGame()}>
                  Try Again
                </Button>

                <Link to="/">
                  <Button id="blue">Main Menu</Button>
                </Link>
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
      {/* Enemy Card */}
      <Grid item xs={3}>
        <Card
          name={enemyState.name}
          health={enemyState.health}
          bio={enemyState.bio}
          img={enemyState.img}
        />
      </Grid>
    </Grid>
  );
};

export default Game;
