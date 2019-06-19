import React from 'react';

import {Slider, Alert} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { withNavigation } from "react-navigation";

import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Button
} from 'react-native';

class SliderVoting extends React.Component {

  changeValue = (sliderValue) => {
    this.props.sliderFunction(this.props.id, sliderValue)
  }

  render() {
    return (
      <Slider
        style={this.props.style}
        minimumValue={-10}
        maximumValue={10}
        minimumTrackTintColor="#A9B3D6"
        maximumTrackTintColor="#A1BDD4"
        thumbTintColor="#9FC3E0"
        step={1}
        value={this.props.value}
        key={this.props.id}
        onValueChange={this.changeValue}/>
    )}
}

class VotingScreen extends React.Component {
  
  constructor(props){
    super(props);
    this.state = { 
        isLoading: true,
        voting: 0};
  }

  static navigationOptions = {
    title: 'Voting',
  };

  getUrlVoting(){
    var sha512 = require("js-sha512");
    var utf8 = require("utf8")
    prefix = sha512(utf8.encode('soce')).slice(0, 6);
    name_address = sha512(utf8.encode(this._getVoting())).slice(0, 64);
    url = 'http://192.168.1.40:8008' + '/state/' + String(prefix) + String(name_address)
    return url
  }

  componentDidMount(){
    voting = this._getVoting()
    voter = 'VoterUsername'
    return fetch(this.getUrlVoting())
      .then((response) => response.json())
      .then((responseJson) => {
        var base64 = require('base-64');
        data = base64.decode(responseJson["data"])
        dataArray = data.split(';')
        console.log(dataArray[4])
        console.log(JSON.parse(dataArray[4]))
        preferences = JSON.parse(dataArray[4])
        method = dataArray[2]
        winner = dataArray[3]//JSON.parse(dataArray[3])
        console.log(preferences[voter])
        preferences_voter = preferences[voter]

        this.setState({
          isLoading: false,
          voting: voting,
          winner: winner,
          method: method,
          preferences: preferences_voter
        }, function(){});
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  _getVoting = () => {
    return this.props.navigation.getParam('voting')
  }

  changeSliderValue = (key, sliderValue) => {
    state = this.state
    state['preferences'][key] = sliderValue
    this.setState(state)
  }

  showAlertVote = () => {
    Alert.alert(
      'Great!',
      'New preferences submitted',
      [
        {text: 'OK', onPress: () => {}},
      ],
      {cancelable: false},
    );
  }

 changePreferencesSawNative = async () => {
    const utf8 = require('utf8')
    const protobuf = require('sawtooth-sdk-react-native/protobuf')
    var sha512 = require("js-sha512");
    const {createContext, CryptoFactory} = require('sawtooth-sdk-react-native/signing')
    const { createHash } = require('sawtooth-sdk-react-native/browserify-bundles/crypto/crypto')
    const cbor = require('./s')
    const base64 = require('base-64');
    const SHA512 = require("crypto-js/sha512");
    const context = createContext('secp256k1')

    const privateKey = await context.newRandomPrivateKey()
    const cf = new CryptoFactory(context);
    const signer = cf.newSigner(privateKey)

    var action = 'set-preferences'
    var name_id = this._getVoting()
    var configurations_preferences_id = 'VoterUsername'
    var sc_method = this.state['preferences']
    var payload = [action, name_id, 
    configurations_preferences_id, JSON.stringify(sc_method)]
    const payloadBytes = cbor.encode(payload.join(';'))

    prefix = sha512(utf8.encode('soce')).slice(0, 6);
    const address1 = prefix + sha512(utf8.encode('VoterUsername')).slice(0, 64);
    const address2 = prefix + sha512(utf8.encode(name_id)).slice(0, 64);

    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: 'soce',
      familyVersion: '1.0',
      inputs: [address1, address2],
      outputs: [address1, address2],
      signerPublicKey: signer.getPublicKey().asHex(),
      batcherPublicKey: signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish()

    const signature = signer.sign(transactionHeaderBytes)

    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signature,
      payload: payloadBytes
    })
    
    const transactions = [transaction]

    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()

    const signatureHeader = signer.sign(batchHeaderBytes)

    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: signatureHeader,
      transactions: transactions
    })

    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish()

    fetch('http://192.168.1.40:8008/batches', {
      method: 'POST',
      headers: {'Content-Type': 'application/octet-stream'},
      body: batchListBytes,
    });

    this.showAlertVote()

  }

  renderSliders = () => {
    if (typeof this.state.preferences === 'undefined'){
      return [<Text> Preferences are empty </Text>]
    }

    _changeSliderValue = this.changeSliderValue
    _changePreferences = this.changePreferencesSawNative

    sliders = [];
    preferences = this.state.preferences
    console.log(preferences)

    Object.keys(preferences).forEach(function(key) {
      console.log(key + " " + preferences[key])
      sliders.push(
        <View key = {key}>
          <View style={styles.SliderBlockStyle}>
            <View style={styles.SliderNameStyle}>
              <Text style={styles.TextNameSlidersStyle}>
              <Text style={{fontWeight: "bold", fontSize:18}}>{key}</Text>: {preferences[key]}
              </Text>
              <SliderVoting
                style={styles.SliderVotingStyle} 
                value={preferences[key]}
                id = {key}
                sliderFunction={_changeSliderValue}/>
            </View>  
            <Text style={styles.TextSlidersStyle}>
              Value of the vote for '{key}' is {preferences[key]}
            </Text>
          </View>   
        </View>
      );
    });
    return sliders;
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20, alignContent: 'center'}}>
          <ActivityIndicator/>
            <Text>
              Loading the information of the voting: {this._getVoting()}
            </Text>
        </View>
      )
    }

    return(
      <View style={styles.Container}>

        <ScrollView style={styles.Container} contentContainerStyle={styles.ContentContainer}>
      
          <View style={styles.VotingInfoContainer}>
            
            <View style={styles.VotingInfoStyle}>
              <Text>
                Voting winner
              </Text>
              <Text style={styles.VotingInfoImportantStyle}>
              {}{}{}{this.state.winner[2]}{this.state.winner[3]}  
              </Text>
            </View>
            
            <View style={styles.VotingInfoStyle}>
              <Text>
                Voting Name
              </Text>
              <Text style={styles.VotingInfoImportantStyle}>
              {this.state.voting} 
              </Text>
            </View>

            <View style={styles.VotingInfoStyle}>
              <Text>
                Voting method
              </Text>
              <Text style={styles.VotingInfoImportantStyle}>
              {this.state.method}
              </Text>

            </View>
          </View>

          <View style={{borderBottomColor: '#0097a7', borderBottomWidth: 1 , width:'80%', marginLeft: 35, marginTop: 10}}/>

          <View style={styles.SlidersViewStyle}>
            {this.renderSliders()}

            <TouchableOpacity onPress={_changePreferences}  style={styles.TouchableButtonVoting}>
              <View style={styles.ViewButtonVoting}>
                <Text style={styles.TextButtonVoting}>{"Submit new preferences"}</Text>
              <Image style={styles.ImageButtonVoting} source={require('./img/vote.png')} />
              </View>
            </TouchableOpacity>

          </View>

        </ScrollView>
      
      </View>

    )
  }
}


export default withNavigation(VotingScreen);

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  VotingInfoImportantStyle:{
    fontSize: 17,
    fontWeight: 'bold',
    color: '#424242',
  },
  TextNameSlidersStyle: {
    fontSize: 17,
  },
  TextSlidersStyle:{
    fontSize: 14,
  },
  SliderBlockStyle:{
    alignContent: 'center',
    fontSize: 18,
    marginBottom: 30,
  },
  SliderNameStyle:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    fontSize: 18,
  },
  SliderVotingStyle: {
    width: 200, 
    height: 40
  },
  SlidersViewStyle:{
    paddingTop: 20,
    paddingRight: 50,
    paddingLeft: 50
  },
  VotingInfoStyle:{
    alignContent: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1
  },
  VotingInfoContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  ButtonSendStyle:{
    marginLeft: 50,
    borderWidth: 1,
    borderColor: '#fff',
    height: 45,
    width: 45,
    borderRadius: 7,
    color: "#841584",
  },
  TouchableButtonVoting: {
    backgroundColor: '#C5E4E8',
    borderWidth: 0.5,
    borderColor: '#C5E8D9',
    height: 40,
    width: 120,
    borderRadius: 7,
    marginTop: 20,
    marginLeft: 130,
  },
  ViewButtonVoting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  TextButtonVoting: {
    color: 'black',
    width: 75,
    height: 35,
    marginLeft: 5,
  },
  ImageButtonVoting: {
    marginTop: 4,
    marginRight: 5,
    marginBottom: 5,
    width: 30, 
    height: 30,
  },

})