import React, {Component} from 'react';

import { StyleSheet,
    View,
    Alert,
    Text,TextInput,
    AsyncStorage, 
    TouchableOpacity,
    CheckBox, PixelRatio,
    Dimensions } 
  from 'react-native';
import { responsiveHeight } from 'react-native-responsive-dimensions';

export default class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: null,  
      password: null,
      minLength: 6,
      maxLength: 12,
      userErrorStatus : false,
      passErrorStatus : false,
      checked: false  
    }
  }
  
  //To validate email, 
  //This will check if the email is 
  //in correct format
  _validateEmail = (email) => {
    var regex= /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
  }

  //This will handle email TextInput.
  //it checks if the email is in correct format or valid , 
  //if not it will display an error.
  _handleEmail = (email) => {
    if(this._validateEmail(email)) {
      this.setState({email: email, userErrorStatus : false}) ;
    } else {
      this.setState({email: email, userErrorStatus : true}) ;
    }
  }
  
  //This will handle password TextInput.
  //it checks if the password is valid in lenght, 
  //if not it will display an error.
  _handlePass = (password) => {
    if(password.length >= this.state.minLength && password.length <= this.state.maxLength){
     this.setState({password : password, passErrorStatus : false}) ;
   }else{
       this.setState({password : password, passErrorStatus : true}) ;
   }
 }

 //Handle checkbox checked and unchecked state
  _handleCheckbox(){
    this.setState({
      checked: !this.state.checked
    })
 }
 //This will trigger when user pressed the login button
 //here, if the 'remember me' checkbox is checked, the 
 // email and password will be stored, and ready to retrieve 
 // for the next launch of the app
  async _userLogin() {
  if(this.state.email && this.state.password){
    if(this.state.checked){
      try {
        await AsyncStorage.setItem('@email:key', this.state.email);
        await AsyncStorage.setItem('@pass:key', this.state.password);
        await AsyncStorage.setItem('@isChecked:key', JSON.stringify(this.state.checked))
      } catch (error) {
        console.log("Error saving data" + error);
      }
    }else{
      AsyncStorage.clear();
    } 
      Alert.alert('Login success', "Thank you for signing in");
  }else{
    Alert.alert("Login failed", "Please provide a valid email & password");
  }
} 
  //This will trigger automatically when the app runs
  //This handle user's email and password stored in
  //the local storage. 
  async _checkStorage (){
    try {
      let email = await AsyncStorage.getItem('@email:key');
      let pass = await AsyncStorage.getItem('@pass:key');
      let chkState = await AsyncStorage.getItem('@isChecked:key');
      
      //Retrieve and display the stored
      //value to email(TextInput) & password(TextInput)
      this.setState({
        password: pass,
        email: email
      })
      //Check and set the state of the
      // 'remember me' checkbox to its last state
      // before the app closes.
     if(chkState == null){
       this.setState({
         checked: false
       })
     }else{
       this.setState({
         checked: true
       })
     }
    } catch (error) {
      console.log("Error getting data" + error);
    }
}
 
 //handle remembered username and password.
  componentDidMount(){
    this._checkStorage();
  }

  
  render() {
      const { userErrorStatus , passErrorStatus } = this.state;
    return (
      <View style={styles.container}>
          
         <TextInput  value={this.state.email} 
            placeholder={'Input email address'}
            onChangeText={email => this._handleEmail(email)}
            style={styles.input}/>

          {this.state.userErrorStatus == true ? (
            <Text style={styles.errorMessage}>Please enter a valid email</Text>) : null }  

          <TextInput secureTextEntry={true} value={this.state.password}
            onChangeText={password => this._handlePass(password)}
            placeholder={'Input password'}
            style={styles.input}/>

          {this.state.passErrorStatus == true ? (<Text style={styles.errorMessage}>
            Password lenght must be atleast 6-12 characters</Text>) : null }  


          <View style={{flexDirection: "row", marginTop: -10, marginLeft: -3}}>
              <CheckBox
                value={this.state.checked} 
                onValueChange={() => this._handleCheckbox()}
              />
              <Text style={{marginTop: 5, fontSize: FontSizer}}>Remember me</Text>
          </View>

         <TouchableOpacity style={styles.button}  disabled={userErrorStatus || passErrorStatus}
           onPress={this._userLogin.bind(this)}> 
            <Text style={styles.buttonText}> Sign in </Text>
          </TouchableOpacity>
      </View>
    );
  }   
}

var errorMessageFontSize;
var FontSizer;

if ((PixelRatio.get() > 1) && PixelRatio.get() <= 1.5) {//mdpi devices
  errorMessageFontSize = 8;
  FontSizer = 13;
}else if((PixelRatio.get() > 1.5) && PixelRatio.get() <= 2){//hdpi devices
  errorMessageFontSize = 12;
  FontSizer = 18;
}else if ((PixelRatio.get() > 2) && PixelRatio.get() <= 2.6){//xhdpi devices
  errorMessageFontSize = 16;
  FontSizer = 28;
}else if ((PixelRatio.get() > 2.6) && PixelRatio.get() <= 3){//xxhdpi devices
  errorMessageFontSize = 20;
  FontSizer = 28;
}

const styles = StyleSheet.create({
  container: {
   padding: 10
  },
  input: {
    height: responsiveHeight(7),
    borderColor: 'purple',
    borderWidth: 1,
    padding: 10,
    fontSize: FontSizer,
    marginBottom: 10,
  },
  button: {
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'purple'
  },
  buttonText: {
    color: 'white',
    fontSize: FontSizer
  },
  errorMessage: {

    fontSize: errorMessageFontSize,
    color:"red",
    marginTop: -7,
    marginBottom: 5,
  }
});
