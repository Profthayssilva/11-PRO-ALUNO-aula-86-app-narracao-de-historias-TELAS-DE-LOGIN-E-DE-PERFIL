// Importação de módulos necessários do React, React Native e outros
import React, { Component } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  Text
} from "react-native";

// Importação do Firebase para autenticação
import firebase from "firebase";

// Importação de uma ferramenta para fontes responsivas
import { RFValue } from "react-native-responsive-fontsize";

// Importação da ferramenta para carregar fontes do Expo
import * as Font from "expo-font";

// Importação da ferramenta para evitar a ocultação automática da tela de introdução
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();

// Definição de uma fonte personalizada
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf"),
};

// Importação do ícone do aplicativo
const appIcon = require("../assets/logo.png");

// Componente principal
export default class LoginScreen extends Component {
  // Estado inicial do componente
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      fontsLoaded: false,
      userSignedIn: false
    };
  }

  // Função para carregar fontes assincronamente
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  // Função chamada quando o componente é montado
  componentDidMount() {
    // Carrega as fontes quando o componente é montado
    this._loadFontsAsync();
  }

  // Função para realizar login usando Firebase
  signIn = async (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // Redireciona para a tela de Dashboard após o login bem-sucedido
        this.props.navigation.replace("Dashboard");
      })
      .catch(error => {
        // Exibe um alerta em caso de erro no login
        Alert.alert(error.message);
      });
  };

  // Renderização do componente
  render() {
    // Verifica se as fontes foram carregadas
    if (this.state.fontsLoaded) {
      // Oculta a tela de introdução
      SplashScreen.hideAsync();
      
      // Desestruturação do estado para acesso fácil aos valores
      const { email, password } = this.state;

      // Renderiza a interface do usuário
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />

          {/* Título do aplicativo */}
          <Text style={styles.appTitleText}>Narração de Histórias</Text>

          {/* Ícone do aplicativo */}
          <Image source={appIcon} style={styles.appIcon} />

          {/* Entrada de texto para o e-mail */}
          <TextInput
            style={styles.textinput}
            onChangeText={text => this.setState({ email: text })}
            placeholder={"Digite o e-mail"}
            placeholderTextColor={"#FFFFFF"}
            autoFocus
          />

          {/* Entrada de texto para a senha */}
          <TextInput
            style={[styles.textinput, { marginTop: 20 }]}
            onChangeText={text => this.setState({ password: text })}
            placeholder={"Digite a senha"}
            placeholderTextColor={"#FFFFFF"}
            secureTextEntry
          />

          {/* Botão de login */}
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => this.signIn(email, password)}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Link para a tela de registro */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.buttonTextNewUser}>Usuário novo?</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
    alignItems: "center",
    justifyContent: "center"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appIcon: {
    width: RFValue(200),
    height: RFValue(200),
    resizeMode: "contain",
    marginBottom: RFValue(20)
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginBottom: RFValue(20)
  },
  textinput: {
    width: RFValue(250),
    height: RFValue(50),
    padding: RFValue(10),
    borderColor: "#FFFFFF",
    borderWidth: RFValue(4),
    borderRadius: RFValue(10),
    fontSize: RFValue(20),
    color: "#FFFFFF",
    backgroundColor: "#15193c",
    fontFamily: "Bubblegum-Sans"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white",
    marginBottom: RFValue(20)
  },
  buttonText: {
    fontSize: RFValue(24),
    color: "#15193c",
    fontFamily: "Bubblegum-Sans"
  },
  buttonTextNewUser: {
    fontSize: RFValue(12),
    color: "#FFFFFF",
    fontFamily: "Bubblegum-Sans",
    textDecorationLine: 'underline'
  }
});

