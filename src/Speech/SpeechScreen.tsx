import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert,
  ImageBackground,
  Dimensions
} from "react-native";
import {Locale, rapiURL, parts, SpeechBtnTypeEnum} from '../constants';
import { NavigationStackScreenProps } from 'react-navigation-stack';
import Voice from "react-native-voice";
import SpellMenuItem from "./SpellMenuItem";
import axios from "axios";
import { Part, Spell } from "../@types/index";
import RecordButton from './RecordButton';
import { isObject } from "util";

type Props = NavigationStackScreenProps<{team: number, part: Part}>
type States = {
  active: boolean;
  error: string;
  result: string;
  partialResults: string[];
  matchedSpellCode: number;
};
export default class SpeechScreen extends Component<Props,States> {
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");
  state = {
    active: false,
    error: "",
    result: "",
    partialResults: [],
    matchedSpellCode: 0
  };
  static navigationOptions = {
    title: "음성인식"
  };
  elements: any[] = []

  constructor(props: Props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    this.sendCommand = this.sendCommand.bind(this);
    this.getMatchedSpell = this.getMatchedSpell.bind(this);

    let spells = this.part.spells
    console.log(spells);
    this.elements = [
      {type: SpeechBtnTypeEnum.Empty}, {type: SpeechBtnTypeEnum.Empty} , {type: SpeechBtnTypeEnum.Empty},
      {type: SpeechBtnTypeEnum.Empty}, {type: SpeechBtnTypeEnum.Empty}, {type: SpeechBtnTypeEnum.Empty},
    ]
    if ( this.part == parts.ARM ) {
      Object.assign(this.elements[0], {type: SpeechBtnTypeEnum.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[2], {type: SpeechBtnTypeEnum.Text, word: spells[1].main, code: spells[1].code});
      Object.assign(this.elements[3], {type: SpeechBtnTypeEnum.Text, word: spells[2].main, code: spells[2].code});
      Object.assign(this.elements[5], {type: SpeechBtnTypeEnum.Text, word: spells[3].main, code: spells[3].code});
    }
    else if ( this.part == parts.BOTTOM ) {
      Object.assign(this.elements[0], {type: SpeechBtnTypeEnum.Text, word: spells[2].main, code: spells[2].code});
      Object.assign(this.elements[1], {type: SpeechBtnTypeEnum.Text, word: spells[4].main, code: spells[4].code});
      Object.assign(this.elements[2], {type: SpeechBtnTypeEnum.Text, word: spells[3].main, code: spells[3].code});
      Object.assign(this.elements[3], {type: SpeechBtnTypeEnum.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[5], {type: SpeechBtnTypeEnum.Text, word: spells[1].main, code: spells[1].code});
    }
    else if ( this.part == parts.HAND ) {
      Object.assign(this.elements[0], {type: SpeechBtnTypeEnum.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[2], {type: SpeechBtnTypeEnum.Text, word: spells[1].main, code: spells[1].code});
    }
    else if ( this.part == parts.WAIST ) {
      Object.assign(this.elements[0], {type: SpeechBtnTypeEnum.Text, word: spells[0].main, code: spells[0].code});
      Object.assign(this.elements[2], {type: SpeechBtnTypeEnum.Text, word: spells[1].main, code: spells[1].code});
    }
    console.log(this.elements);
  }

  // render
  render() {
    let btn = (
      <TouchableWithoutFeedback onPress={this.startRecognizing}>
        <Image
          style={styles.button}
          source={require("../images/ready_button.png")}
        />
      </TouchableWithoutFeedback>
    );
    if (this.state.active) {
      btn = (
        <TouchableWithoutFeedback onPress={this.stopRecognizing}>
          <Image
            style={styles.button}
            source={require("../images/active_button.png")}
          />
        </TouchableWithoutFeedback>
      );
    }
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.full}>
        <View style={styles.container}>
          <View style={styles.top}>
            <Text style={styles.title}>Voice Control View</Text>
            <View style={styles.spellMenuContainer}>
              {this.renderSpellMenuItems(this.elements)}
            </View>
          </View>
          <View style={styles.middle}>
            <View style={styles.resultTextContainer}>
              <View style={styles.resultOverlay}></View>
              <Text style={styles.resultText}>{this.state.result}</Text>
            </View>
          </View>
          <View style={styles.bottom}>
            {btn}
            {false && <RecordButton style={styles.recordButton} part={this.part}></RecordButton>}
          </View>
          <View style={styles.allStopBtnContainer}>
            <TouchableWithoutFeedback onPress={() => {
              this.stopRecognizing();
              this.sendCommand(this.part.stop.code, 10, () => {
                this.setState({
                  active: false,
                  result: '',
                  matchedSpellCode: 0
                });
              })}}>
              <Text style={styles.allStopBtn}>중지</Text>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </ImageBackground>
    );
  }
  renderSpellMenuItems = (elements: any[]) => {
    let spellMenuItmes: JSX.Element[] = [];
    for ( const [index, el] of elements.entries() ) {
      let isMatched = false;
      if ( this.state.matchedSpellCode ==  el.code) {
        isMatched = true;
      }
      spellMenuItmes.push(
        <View style={styles.spellMenuItemWrapper}>
          <SpellMenuItem type={el.type} key={el.word + index} word={el.word} isMatched={isMatched} />
        </View>
      )
    }
    return spellMenuItmes;
  }

  // custom function
  sendCommand(code: number, speed: number, callback: () => void) {
    callback();
    let url: string = `${rapiURL(this.team)}/${code}/${speed}`;
    console.log('url', url);
    axios(url).then((response) => {
      if ( response.status == 201 ) {
      } else {
      }
    }).catch((err) => {
      Alert.alert("ERROR", "통신에러");
    });
  }
  getMatchedSpell(spellWord: string): { code: number, speed: number } {
    let matchedSpellCode = 0;
    let speed = 0;
    spellWord = spellWord.replace(/\s/g, "");
    console.log('spell', spellWord);
    this.part.spells.forEach((i: Spell) => {
      i.similar.forEach((z: string) => {
        if (z == spellWord) {
          matchedSpellCode = i.code;
          speed = i.speed;
        }
      });
    });
    return {
      code: matchedSpellCode,
      speed: speed
    }
  }

  // life cycle
  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  // voice recognition functions
  onSpeechStart = (e: Voice.StartEvent) => {
    // eslint-disable-next-line
    console.log("onSpeechStart: ", e)
  };

  // ios 를 위한 처리
  onSpeechEnd = (e: Voice.EndEvent) => {
    console.log("onSpeechEnd");
    // eslint-disable-next-line

    // ios는 result -> end순서로 호출되고,
    // android는 end -> result순서로 호출되기 때문에 다르게 지정해줘야한다
    if ( Platform.OS != 'ios' ) { return; }
    if ( this.state.result == '' ) { return; }

    let result = this.getMatchedSpell(this.state.result);
    console.log('result in speech end', result);
    if ( result.code > 0 ) {
      this.sendCommand(result.code, result.speed, () => {
        this.setState({
          active: false,
          matchedSpellCode: 0
        });
      });
    } else {
      this.setState({
        active: false,
        result: ''
      });
    }
  };
  onSpeechError = (e: Voice.ErrorEvent) => {
    console.log(e);
    this.setState({
      error: JSON.stringify(e.error),
      active: false
    });
  };

  // android 를 위한 처리
  onSpeechResults = (e: Voice.Results) => {
    const val: string = e.value[0];
    console.log(`onSpeechResults - val : ${val}`);
    this.setState({
      result: val
    }, () => {
      if ( Platform.OS != 'android' ) { return; }
      if ( this.state.result == '' ) { return; }

      let result = this.getMatchedSpell(this.state.result);
      console.log('result', result);
      if ( result.code > 0 ) {
        this.sendCommand(result.code, result.speed, () => {
          this.setState({
            active: false,
            matchedSpellCode: 0
          });
        });
      } else {
        console.log('nothing matched');
        this.setState({
          active: false,
          result: ''
        });
      }
    });
  };
  startRecognizing = async () => {
    this.setState({
      active: true,
      error: "",
      result: '',
      partialResults: [],
      matchedSpellCode: 0
    });
    try {
      await Voice.start(Locale.ko_KR);
    } catch (e) {
      console.error(e);
    }
  };
  stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };
  cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };
  destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    this.setState({
      error: "",
      result: '',
      partialResults: []
    });
  };
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const windowRatio = Number((windowHeight/windowWidth).toFixed(2));
const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%'
  },
  button: {
    width: 75,
    height: 75
  },
  container: {
    flex: 1,
    paddingTop: 50,
    justifyContent: "space-between",
    paddingBottom: 80,
    position: 'relative',
    paddingLeft: '6%',
    paddingRight: '6%',
  },
  spellMenuContainer: {
    width: (windowRatio < 1.9 ? '60%' : '80%'),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center'
  },
  spellMenuItemWrapper: {
    width: '33.33%',
    aspectRatio: 1.2
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    color: 'white',
    marginBottom: 40
  },
  top: {
    width: '100%',
    alignItems: 'center',
  },
  middle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  resultOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0.3,
    borderRadius: 20
  },
  dFlex: {
    display: "flex"
  },
  resultTextContainer: {
    width: '60%',
    height: 50,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  resultText: {
    textAlign: 'center',
    fontSize: 30,
    color: 'black',
  },
  bottom: {
    display: "flex",
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  recordButton: {
    position: "absolute",
    right: 0
  },
  allStopBtnContainer: {
    padding: 10,
    width: '100%',  //The Width must be the same as the height
    backgroundColor:'rgb(195, 125, 198)',
    position: 'absolute',
    bottom: 20,
    right: 0,
    left: 0,
  },
  allStopBtn: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white'
  }
});