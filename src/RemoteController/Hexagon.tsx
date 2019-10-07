import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from "react-native";
import Svg, {
  Text as SVGText,
  TextPath,
  Path,
  Image
} from 'react-native-svg';
import { RemoteBtnType } from '../constants';
import { HexagonBtnProps } from "../@types/index";

type Props = {}
type States = {}
export default class Hexagon extends Component<HexagonBtnProps, States> {
  constructor(props: HexagonBtnProps) {
    super(props);
  }
  render() {
    if ( this.props.type == RemoteBtnType.Empty ) {
      return (<View style={styles.empty}></View>)
    }
    if ( this.props.type == RemoteBtnType.Text ) {
      var opacity = '1.0';
      if ( ! this.props.command ) {
        opacity = '0.3';
      }
      var strokeColor = "gold";
      if ( this.props.isActive ) {
        strokeColor = "blue";
      }
      return (
        <Svg width="100%" height="100%" viewBox="0 0 120 100" onPress={() => { if ( this.props.command ) { this.props.onPress(this.props.btnNumber, this.props.command) } }}>
          <Path
            d="M 32.9,3 C 3,50.5 3,51.56 3,51.56 L 32.9,98 90.4,98 118,51.56 90.4,3 32.9,3 Z M 32.9,3"
            fill="none"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinecap="round">
          </Path>
          <SVGText
            fontFamily="Helvetica"
            fontWeight="bold"
            fontSize="32"
            textAnchor="middle"
            x="60"
            y="53"
            opacity={opacity}
            alignmentBaseline="central"
            fill="white">
            {this.props.text}
          </SVGText>
        </Svg>
      )
    }
    if ( this.props.type == RemoteBtnType.PlaceHoldImage ) {
      return (
        <Svg width="100%" height="100%" viewBox="0 0 120 100">
          <Path
            d="M 32.9,3 C 3,50.5 3,51.56 3,51.56 L 32.9,98 90.4,98 118,51.56 90.4,3 32.9,3 Z M 32.9,3"
            fill="none"
            stroke="gold"
            strokeWidth="5"
            strokeLinecap="round">
          </Path>
          <Image
            width="70%"
            height="70%"
            x="20"
            y="16"
            preserveAspectRatio="xMidYMid slice"
            opacity="1.0"
            href={require('../images/core.png')}
            clipPath="url(#clip)"
          />
        </Svg>
      )
    }
  }
}

const styles = StyleSheet.create({
  empty: {
    width: '100%',
    height: '100%'
  }
})