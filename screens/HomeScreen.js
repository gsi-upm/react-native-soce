import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import { MonoText } from '../components/StyledText';

import MultiSelectList from './home/MultiSelectList.js'

export default class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  static navigationOptions = {
    title: 'Home',
  };

  getUrl(){
  	var sha512 = require("js-sha512");
  	var utf8 = require("utf8")
  	prefix = sha512(utf8.encode('soce')).slice(0, 6);

  	name_address = sha512(utf8.encode('voter1')).slice(0, 64);

  	url = 'http://192.168.1.40:8008' + '/state/' + String(prefix) + String(name_address)
  	return url
  }

   componentDidMount(){
    console.log(this.getUrl())
    return fetch(this.getUrl())
      .then((response) => response.json())
      .then((responseJson) => {
      	var base64 = require('base-64');
      	data = base64.decode(responseJson["data"])
      	dataArray = data.split(';')
      	preferences = JSON.parse(dataArray[2])
      	votings = Object.keys(preferences)
      	dataList = []

		for (i = 0, len = votings.length ; i < len; i++) { 
  			v = {'id': String(i), 'key': votings[i]};
  			dataList.push(v);
  		}

        this.setState({
          isLoading: false,
          data: dataList,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
          </View>

          <View style={styles.getStartedContainer}>

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <MultiSelectList
			  data={[{id: 'a', title: 'data1'}, {id: 'b', title: 'data2'}]}
			  renderItem={({item}) => <Text>{item.key}</Text>}
			/>

			<MultiSelectList
			  data={this.state.data} navigation={this.props.navigation}
			  renderItem={({item}) => <Text>{item.key}</Text>}
			/>

            <Text style={styles.getStartedText}>
              Change this text hola and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});