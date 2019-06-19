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
    this.state = {isLoading: true}
  }

  static navigationOptions = {
    title: 'Home',
  };

  getUrl(object){
    console.log(object)
  	var sha512 = require("js-sha512");
  	var utf8 = require("utf8")
  	prefix = sha512(utf8.encode('soce')).slice(0, 6);
  	name_address = sha512(utf8.encode("VoterUsername")).slice(0, 64);
  	url = 'http://192.168.1.40:8008' + '/state/' + String(prefix) + String(name_address)
  	return url
  }

  getVotings(voter){
    fetch(this.getUrl(voter))
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(voter)
        console.log(responseJson)
        var base64 = require('base-64');
        data = base64.decode(responseJson["data"])
        console.log('data', data)
        dataArray = data.split(';')
        preferences = JSON.parse(dataArray[2])
        votings = Object.keys(preferences)
        var dataList = []
        for (i = 0, len = votings.length ; i < len; i++) {
          var v = votings[i]
          dataList.push(v);
        }
        this.setState({
          isLoading: true,
          data: [],
        });
        console.log('datalist', dataList)
        for (j = 0, len2 = dataList.length ; j < len2; j++) {
          fetch(this.getUrl(dataList[j]))
          .then((response) => response.json())
          .then((responseJson) => {
            data = base64.decode(responseJson["data"])
            console.log('data2', data)
            dataArray = data.split(';')
            console.log(22)
            votingName = dataArray[0]
            preferences = JSON.parse(dataArray[4])
            console.log(33)
            if ('VoterUsername' in preferences){
              var vs = {'id': String(j), 'key': votingName};
              console.log(44, vs)
              var newData = this.state.data;
              newData.push(vs);
              console.log(newData)   
              this.setState({
                isLoading: false,
                data: newData,
              });
              console.log('state', this.state)
            }
      })}
  })}

  getVoter = async () => {
    return "VoterUsername"
    //try {
    //    const value = await AsyncStorage.getItem('VoterUsername')
    //  if(value !== null) {
    //    // value previously stored
    //  }else{}
    //} catch(e) {}
  }

  //componentDidMount(){
  //  var voter = this.getVoter()
  //  this.getVotings(voter)
  //}

  componentDidMount(){
    console.log(this.getUrl("VoterUsername"))
    return fetch(this.getUrl("VoterUsername"))
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
        <View style={{flex: 1, padding: 20, alignContent: 'center',}}>
          <ActivityIndicator/>
          <Text>
          Loading the votings of the voter: 'VoterUsername'
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.Container}>
        
        <View style={styles.Container} contentContainerStyle={styles.ContentContainer}>
          
          <View style={styles.ButtonsContainer}> 
            <TouchableOpacity style={styles.TouchableButtonReloadStyle} onPress={() => this.getVotings()} activeOpacity={0.5}>
              <Image source={require('./img/reload.png')}
              style={styles.ImageIconStyleReload}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TouchableButtonProfileStyle} activeOpacity={0.5}>
              <Image source={require('./img/profile.png')}
              style={styles.ImageIconStyleProfile}/>
            </TouchableOpacity>
          </View>
          
          <View style={styles.GetStartedContainer}>
            <Text style={styles.GetStartedText}>
              Select a voting to know its status and to define preferences 
            </Text>
            <View style={{height: 25}}>
            </View>
            <MultiSelectList
            data={this.state.data} navigation={this.props.navigation}
  			    renderItem={({item}) => <Text style={{width:1000}}>{item.key}</Text>}
  			    />
          </View>

        </View>

        <View style={styles.AckContainer}>
          <View style={{borderBottomColor: 'grey', borderBottomWidth: 0.5,}}/>
          <View style={styles.AckImagesContainer}>
            <Image source={require('./img/upm.png')} style={styles.ImageStyleUPM}/>
            <Image source={require('./img/dit.png')} style={styles.ImageStyleDIT}/>
            <Image source={require('./img/gsi.png')} style={styles.ImageStyleGSI}/>
          </View>
        </View>
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
    height: 500
  },
  ButtonsContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingTop: 30,
    paddingHorizontal: 30,
  },
  GetStartedContainer: {
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  GetStartedText: {
    fontSize: 15,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    paddingTop: 30,
  },
  TouchableButtonReloadStyle: {
    paddingRight: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#fff',
    height: 45,
    width: 45,
    borderRadius: 7,
    margin: 0,
  },
  TouchableButtonProfileStyle: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#fff',
    height: 45,
    width: 45,
    borderRadius: 7,
    margin: 0,
  },
  ImageIconStyleReload: {
    padding: 0,
    margin: -9,
    height: 45,
    width: 60,
  },
  ImageIconStyleProfile: {
    padding: 0,
    margin: 7,
    height: 30,
    width: 30,
  },
  AckImagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 10,
  },
  AckContainer: {
    height: 50,
    flex: 1,
    justifyContent: 'flex-end',
  },
  ImageStyleUPM: {
    margin: 7,
    height: 40,
    width: 40,
  },
  ImageStyleGSI: {
    margin: 7,
    height: 35,
    width: 38,
  },
  ImageStyleDIT: {
    margin: 6,
    height: 40,
    width: 40,
  },

});