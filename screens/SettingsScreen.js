import React from 'react';
import { TextInput, Text } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (<React.Fragment>
    		<Text>User id</Text>
    		<TextInput
                            style={{ height: 40, width: '50%' }}
                            placeholder='From'
                            //value={cargar de memoria}
                            keyboardType='numeric'
                        />
            <Text>Username</Text>

            <TextInput
                            style={{ height: 40, width: '50%' }}
                            placeholder='From'
                            //value={cargar de memoria}
                            keyboardType='numeric'
                        />
            <Text>Password</Text>

            <TextInput
                            style={{ height: 40, width: '50%' }}
                            placeholder='From'
                            //value={cargar de memoria}
                            keyboardType='numeric'
                        />
            </React.Fragment>
            );
  }
}


