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
      <TouchableOpacity onPress={this._onPress}  style={styles.button}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text style={{color: 'black'}}>{this.props.title}</Text>
        <Image style={styles.image} source={require('../img/arrow2.png')} />
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
    } catch (error) {
  }
  }

  _onPressItem = (title: string) => {
    // updater functions are preferred for transactional updates
    //this.setState((state) => {
      // copy the map rather than modifying state.
      //const selected = new Map(state.selected);
      //selected.set(id, !selected.get(id)); // toggle
      //return {selected};

    //this.storeData(id);
    this.props.navigation.navigate('Voting', {voting: title});
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
  button: {
    alignItems: 'center',
    backgroundColor: '#e1f5fe',
    padding: 20
  },
  image: {
    width: 13, 
    height: 13
  }
})

export default MultiSelectList;