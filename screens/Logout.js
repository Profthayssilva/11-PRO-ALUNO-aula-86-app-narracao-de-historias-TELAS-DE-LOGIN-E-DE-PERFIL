import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase";

export default class Logout extends Component {
    //componentDidMountmétodo de ciclo de vida, que chama firebase.auth().signOut()para desconectar o usuário usando a autenticação Firebase.
  componentDidMount() {
    firebase.auth().signOut();
    this.props.navigation.replace("Login");
  }
  //retorna uma visualização com um elemento de texto exibindo “Logout”.
  render() {
    return (
      <View style={styles.container}>
        <Text>Logout</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});