import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import LoginForm from './src/components/Login/LoginForm';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.logoContainer}>
             <Image
              style={styles.logo} 
              source={require('./images/Logo.png')}/>
          </View>
          <View style={styles.formContainer}>
            <LoginForm/>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  logoContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: '60%',
    height:'60%',
    resizeMode: 'contain'
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  }
});
