import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen'

import VotingScreen from '../screens/VotingScreen'

const AppStack = createStackNavigator({ Home: HomeScreen, Voting: VotingScreen });

export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  App: AppStack,
}));