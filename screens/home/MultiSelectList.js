import React from 'react';

import {AsyncStorage} from 'react-native';

import {
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,

} from 'react-native';

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.title);
  };

  render() {
    const textColor = this.props.selected ? 'red' : 'black';
    return (
      <TouchableOpacity onPress={this._onPress}  style={styles.TouchableButtonVoting}>
        <View style={styles.ViewButtonVoting}>
          <Text style={styles.TextButtonVoting}>{this.props.title}</Text>
        <Image style={styles.ImageButtonVoting} source={require('../img/arrow1.png')} />
        </View>
      </TouchableOpacity>
      );
  }
}

class MultiSelectList extends React.PureComponent {
  state = {selected: (new Map(): Map<string, boolean>)};
  _keyExtractor = (item, index) => item.id;
  storeData = async (id: string) => {
    try {
      await AsyncStorage.setItem('voting', id)
    } catch (error) {}
  }

  _onPressItem = (title) => {
    this.props.navigation.navigate('Voting', 
      {voting: title});
  }

  _renderItem = ({item}) => (
    <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      title={item.key}
    />
  );

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}



const styles = StyleSheet.create({

  TouchableButtonVoting: {
    backgroundColor: '#C5E4E8',
    borderWidth: 0.5,
    borderColor: '#C5E8D9',
    height: 35,
    width: 250,
    borderRadius: 7,
    marginBottom: 5,
  },
  ViewButtonVoting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  TextButtonVoting: {
    color: 'black',
    marginLeft: 55,
    width: 120,
    height: 70,
    fontSize: 18,
    marginTop: 4,
  },
  ImageButtonVoting: {
    marginTop: 10,
    marginRight: 10,
    width: 15, 
    height: 15,
  },
});

export default MultiSelectList;