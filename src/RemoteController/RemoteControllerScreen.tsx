import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ImageBackground,
  Dimensions
} from "react-native";
import { NavigationScreenProps, NavigationParams } from "react-navigation";
import Hexagon from "./Hexagon";
import { RemoteBtnType, parts, rapiURL, serverURL } from '../constants';
import { HexagonBtnProps, Part, SpellOnRemote } from "../@types";
import axios from "axios";
import { number } from 'prop-types';

type States = {
  activeBtnNumber: number|undefined,
  commandRightBefore: string|undefined,
  sendingCommand: boolean
};
export default class RemoteControllerScreen extends Component<NavigationScreenProps<NavigationParams>,States> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.state = {
      activeBtnNumber: undefined,
      commandRightBefore: undefined,
      sendingCommand: false
    }
    this.elements = [
      {type: RemoteBtnType.Empty}, {type: RemoteBtnType.PlaceHoldImage} , {type: RemoteBtnType.Empty},
      {type: RemoteBtnType.Text, text: "펴"}, {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "접어"},
      {type: RemoteBtnType.Text, text: "들어"}, {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "내려"},
      {type: RemoteBtnType.Empty}, {type: RemoteBtnType.Text, text: "빠르게"}, {type: RemoteBtnType.Empty},
      {type: RemoteBtnType.Text, text: "왼쪽"}, {type: RemoteBtnType.Text, text: "앞으로"}, {type: RemoteBtnType.Text, text: "오른쪽"},
      {type: RemoteBtnType.PlaceHoldImage}, {type: RemoteBtnType.Text, text: "뒤로"}, {type: RemoteBtnType.PlaceHoldImage}
    ]
    if ( this.part == parts.ARM ) {
      this.part.spells.forEach(part => {
        if ( this.elements[3].text == part.main ) {
          this.elements[3].command = part.command;
        }
        else if ( this.elements[5].text == part.main ) {
          this.elements[5].command = part.command;
        } else if ( this.elements[6].text == part.main ) {
          this.elements[6].command = part.command;
        } else if ( this.elements[8].text == part.main ) {
          this.elements[8].command = part.command;
        }
      });
    }
    else if ( this.part == parts.BOTTOM ) {
      this.part.spells.forEach(part => {
        // 10 = 빠르게
        if ( this.elements[10].text == part.main ) {
          this.elements[10].command = part.command;
        }
        // 12 = 왼쪽
        else if ( this.elements[12].text == part.main ) {
          this.elements[12].command = part.command;
        }
        // 13 = 앞으로
        else if ( this.elements[13].text == part.main ) {
          this.elements[13].command = part.command;
        }
        // 14 = 오른쪽
        else if ( this.elements[14].text == part.main ) {
          this.elements[14].command = part.command;
        }
        // 16 = 뒤로
        else if ( this.elements[16].text == part.main ) {
          this.elements[16].command = part.command;
        }
      });
    } else if ( this.part == parts.HAND ) {
      this.part.spells.forEach(part => {
        if ( this.elements[3].text == part.main ) {
          this.elements[3].command = part.command;
        }
        else if ( this.elements[5].text == part.main ) {
          this.elements[5].command = part.command;
        }
      });
    } else if ( this.part == parts.WAIST ) {
      this.part.spells.forEach(part => {
        if ( this.elements[12].text == part.main ) {
          this.elements[12].command = part.command;
        }
        else if ( this.elements[14].text == part.main ) {
          this.elements[14].command = part.command;
        }
      });
    }
  }
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");
  elements: any[] = []
  sendCommand = (btnNumber:number, command: string, isStop: boolean) => {
    var url = `${rapiURL(this.team)}/${command}`;
    axios(url).then((response) => {
      if (response.status == 201) {
        if (response.data.error) {
          this.setState({
            activeBtnNumber: undefined,
            sendingCommand: false
          });
          // Alert.alert(response.data.error);
          return;
        }
        this.setState({
          activeBtnNumber: isStop ? undefined : btnNumber,
          sendingCommand: false
        });
      } else {
        this.setState({
          activeBtnNumber: undefined,
          sendingCommand: false
        });
        // Alert.alert("ERROR", "통신 에러");
      }
    }).catch((err) => {
      this.setState({
        activeBtnNumber: undefined,
        sendingCommand: false
      });
      // Alert.alert("ERROR", "알수없는 에러가 발생했습니다");
    });
  }
  handleClickBtn = (btnNumber: number, command: string) => {
    // 현재 명령을 보내고 있는지 체크
    if ( ! this.state.sendingCommand ) {

      // inactive상태의 버튼을 눌렀을때
      if ( this.state.activeBtnNumber != btnNumber ) {
        this.sendCommand(btnNumber, command, false);
      }

      // active 상태의 버튼을 눌렀을때
      else {
        var commandArray = command.split('/');
        var stopCommand = `${commandArray[0]}/stop`;
        this.sendCommand(btnNumber, stopCommand, true);
      }

    }
  }
  renderBoxes = () => {
    const items = []
    for ( const [index, value] of this.elements.entries() ) {
      var isActive = false;
      if ( (index+1) == this.state.activeBtnNumber ) {
        isActive = true;
      }
      items.push(
        <View style={styles.box} key={index}>
          <Hexagon type={value.type} text={value.text} command={value.command} onPress={this.handleClickBtn} btnNumber={index+1} isActive={isActive}></Hexagon>
        </View>);
    }
    return items
  }
  render() {
    return (
      <ImageBackground source={require("../images/default-background.jpeg")} style={styles.full}>
        <View style={styles.container}>
          <Text style={styles.title}>Remote Control View</Text>
          <View style={styles.wrapper}>
            {this.renderBoxes()}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const windowRatio = Number((windowHeight/windowWidth).toFixed(2));
const styles = StyleSheet.create({
  full: {
    width: '100%',
    height: '100%'
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 15
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  wrapper: {
    width: (windowRatio < 1.9 ? '80%' : '90%'),
    height: '82%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center'
  },
  box: {
    width: '33.33%',
    aspectRatio: 1.2
  },
});