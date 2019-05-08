import React from 'react';

import {AsyncStorage, Slider} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { withNavigation } from "react-navigation";


//import { RSA } from 'react-native-rsa-native';

// import secp256k1 from 'react-native-secp256k1';


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
        minimumValue={this.props.minimumValue}
        maximumValue={this.props.maximumValue}
        minimumTrackTintColor={this.props.minimumTrackTintColor}
        maximumTrackTintColor={this.props.maximumTrackTintColor}
        step={this.props.step}
        value={this.props.value}
        key={this.props.id}
        onValueChange={this.changeValue}/>

      )}
}

class VotingScreen extends React.Component {
  

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
    state = {voting: 0}
  }
  

  static navigationOptions = {
    title: 'Voting',
  };

  

  getUrlVoting(){
    var sha512 = require("js-sha512");
    var utf8 = require("utf8")
    console.log(11, utf8.encode('soce'))
    console.log(22, sha512(utf8.encode('soce')))
    prefix = sha512(utf8.encode('soce')).slice(0, 6);
    console.log(prefix)

    name_address = sha512(utf8.encode('voting1')).slice(0, 64);

    url = 'http://192.168.1.40:8008' + '/state/' + String(prefix) + String(name_address)
    return url
  }

   getUrlPreferences(){
    //
    //var protobuf = require('sawtooth-sdk/protobuf')
    //var sha512 = require("js-sha512");
    //var utf8 = require("utf8")
    //console.log(11, utf8.encode('soce'))
    //console.log(22, sha512(utf8.encode('soce')))
    //prefix = sha512(utf8.encode('soce')).slice(0, 6);
    //console.log(prefix)
    //name_address = sha512(utf8.encode('voting1')).slice(0, 64);
    //

    url = 'http://192.168.1.40:8008' + '/batches'
    return url
  }

   componentDidMount(){
    console.log('montando')
    voting = this._getVoting()
    voter = 'voter1'
    console.log(this.getUrlVoting())
    return fetch(this.getUrlVoting())
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        console.log(typeof(responseJson))
        console.log(responseJson["data"])
        var base64 = require('base-64');
        data = base64.decode(responseJson["data"])
        console.log(data)
        dataArray = data.split(';')
        console.log(99, dataArray)
        //
        preferences = JSON.parse(dataArray[4])
        method = dataArray[2]
        winner = dataArray[3]
        console.log(preferences)
        preferences_voter = JSON.parse(preferences[voter].replace(/'/g, '"'))
        console.log('Hasta aqui2', preferences_voter)

        this.setState({
          isLoading: false,
          voting: voting,
          winner: winner,
          method: method,
          preferences: preferences_voter
        }, function(){
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

 componentWillUnmount() {
    this.focusListener.remove();

  }

    getData = async () => {
  try {
    const value = await AsyncStorage.getItem('voting')
    console.log('value2', value)
    if(value !== null) {
      return value
    }
    } catch(e) {
    // error reading value
    }
    }

  _getVoting = () => {
    return this.props.navigation.getParam('voting')
  }

  changeSliderValue = (key, sliderValue) => {
    console.log('caso1', this.state)
    state = this.state
    state['preferences'][key] = sliderValue
    this.setState(state)
    console.log('caso2', this.state)
    }

 changePreferencesSawNative = async () => {
    const utf8 = require('utf8')
    const protobuf = require('sawtooth-sdk-react-native/protobuf')
    var sha512 = require("js-sha512");
    const {createContext, CryptoFactory} = require('sawtooth-sdk-react-native/signing')
    const { createHash } = require('sawtooth-sdk-react-native/browserify-bundles/crypto/crypto')
    
    var cbor = require('./s')

    console.log(cbor)
    var base64 = require('base-64');
    
    const context = createContext('secp256k1')
    const privateKey = await context.newRandomPrivateKey()
    const cf = new CryptoFactory(context);
    const signer = cf.newSigner(privateKey)


    var SHA512 = require("crypto-js/sha512");

    //var SHA512 = require("react-native-crypto-js").SHA512;

    var action = 'set-preferences'
    var name_id = 'voting1'
    var configurations_preferences_id = 'voter1'
    var sc_method = {"a": 10, "b": 10}


    var payload = [action, name_id, 
    configurations_preferences_id, JSON.stringify(sc_method)]

    console.log("ou mama",payload)

    console.log("ou mama2",payload.join(';'))

    //const payloadBytes = utf8.encode(payload.join(';'))

    //const payloadBytes2 = new Uint8Array(payloadBytes); //ESto genera bytes, que es lo bueno.

    const payloadBytes = cbor.encode(payload.join(';'))
    console.log(13123123213123, payloadBytes)
    prefix = sha512(utf8.encode('soce')).slice(0, 6);
    const address1 = prefix + sha512(utf8.encode('voter1')).slice(0, 64);
    const address2 = prefix + sha512(utf8.encode('voting1')).slice(0, 64);

    console.log(92103912039120392,address1)

    console.log(444444444444, address2)

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

    console.log(111111, createHash('sha512').update(payloadBytes).digest('hex'))


    console.log(transactionHeaderBytes)

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

    console.log('mas aun')

    const signatureHeader = signer.sign(batchHeaderBytes)

    console.log('firmar otra vez')

    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: signatureHeader,
        transactions: transactions
    })

    console.log('firmar otra y otra')


    const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
    }).finish()

    console.log('bath')


    fetch('http://192.168.1.40:8008/batches', {
      method: 'POST',
      headers: {'Content-Type': 'application/octet-stream'},
      body: batchListBytes,
    });
  
  }

  renderSliders = () => {

    if  (typeof this.state.preferences === 'undefined'){
      return [<Text>
      preferences are empty
      </Text>]
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
      <Text>
      {key}
      </Text>
      <SliderVoting
        style={{width: 200, height: 40}}
        minimumValue={-10}
        maximumValue={10}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        step={1} 
        value={preferences[key]}
        id = {key}
        sliderFunction={_changeSliderValue}/>
      </View>
      );
    });
    return sliders;
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
      <View>
      <Text>
              {this.state.voting} {this.state.winner} 
               {this.state.method}
      </Text>
      {this.renderSliders()}
      <Button
        onPress={_changePreferences}
        title="Cambiar preferencias"
        color="#841584"
/>
      </View>
    );
  }
}


export default withNavigation(VotingScreen);
