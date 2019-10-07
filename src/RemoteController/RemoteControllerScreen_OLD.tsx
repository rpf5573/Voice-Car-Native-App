import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text
} from "react-native";
import { rapiURL, parts } from '../constants';
import { NavigationScreenProps, NavigationParams } from "react-navigation";
import axios from "axios";
import { Part, SpellOnRemote } from "../@types/index";
import Spell from './Spell_OLD';

type States = {};
export default class RemoteControllerScreen extends Component<NavigationScreenProps<NavigationParams>,States> {
  constructor(props: NavigationScreenProps) {
    super(props);
    this.renderSpells = this.renderSpells.bind(this);
    let spells: SpellOnRemote[] = [];
    Object.entries(parts).forEach( ([key, value]) => {
      let active = false;
      if ( value.id == this.part.id ) {
        active = true;
      }
      spells.push(
        ...value.spells.map((spell) => {
          return {
            main: spell.main,
            active: active,
            command: spell.command!
          }
        })
      );
    });
    this.spells = spells;
  }
  spells: SpellOnRemote[];
  team: number = this.props.navigation.getParam("team");
  part: Part = this.props.navigation.getParam("part");

  static navigationOptions = {
    title: "리모컨"
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.title}>
          <Text style={styles.title_text}>리모컨 페이지</Text>
          <Text style={styles.title_description}>주황색 버튼을 누르면 포크레인이 움직입니다</Text>
        </View>
        <View style={styles.spellsContainer}>
          <View style={styles.spells}>
            {this.renderSpells(this.spells)}
          </View>
        </View>
      </View>
    );
  }
  renderSpells(_spells: SpellOnRemote[]) {
    let key = 0;
    let spells = _spells.map((spell) => {
      key += 1;
      return <Spell key={key} spell={spell.main} active={spell.active} team={this.team} command={spell.command}></Spell>
    });
    return spells;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    position: 'relative'
  },
  title: {},
  title_text: {
    fontSize: 24,
    textAlign: 'center'
  },
  title_description: {
    fontSize: 20,
    textAlign: 'center'
  },
  spellsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spells: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});