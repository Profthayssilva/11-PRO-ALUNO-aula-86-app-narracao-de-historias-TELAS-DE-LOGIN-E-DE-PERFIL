// Importação dos módulos e dependências necessárias
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Switch
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as Font from "expo-font";

// Importação do módulo SplashScreen do Expo
import * as SplashScreen from 'expo-splash-screen';

// Prevenção do ocultamento automático da splash screen
SplashScreen.preventAutoHideAsync();

// Importação do módulo Firebase
import firebase from "firebase";

// Definição das fontes personalizadas a serem carregadas
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

// Definição do componente Profile
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      name: ""
    };
  }

  // Função de alternância do switch para mudar o tema
  toggleSwitch() {
    // Captura o estado anterior do switch
    const previous_state = this.state.isEnabled;
    // Determina o tema com base no estado do switch
    const theme = !this.state.isEnabled ? "dark" : "light";
    
    // Atualiza o tema atual do usuário no banco de dados Firebase
    var updates = {};
    updates["/users/" + firebase.auth().currentUser.uid + "/current_theme"] = theme;
    firebase
      .database()
      .ref()
      .update(updates);
    
    // Atualiza o estado para refletir o novo tema e estado do switch
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  // Carrega assincronamente as fontes personalizadas
  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  // Método do ciclo de vida: Componente foi montado
  componentDidMount() {
    // Carrega as fontes personalizadas e obtém informações do usuário
    this._loadFontsAsync();
    this.fetchUser();
  }

  // Obtém assincronamente as informações do usuário no Firebase
  async fetchUser() {
    let theme, name, image;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        theme = snapshot.val().current_theme;
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
      });
    
    // Atualiza o estado do componente com base nas informações do usuário obtidas
    this.setState({
      light_theme: theme === "light" ? true : false,
      isEnabled: theme === "light" ? false : true,
      name: name
    });
  }

  // Método de renderização: Exibe a interface do componente
  render() {
    // Verifica se as fontes personalizadas foram carregadas
    if (this.state.fontsLoaded) {
      // Oculta a splash screen
      SplashScreen.hideAsync();
      return (
        // Visão principal do container
        <View style={styles.container}>
          {/* SafeAreaView para lidar com a barra de status */}
          <SafeAreaView style={styles.droidSafeArea} />
          
          {/* Seção do título do aplicativo */}
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={styles.appTitleText}>App Narração de Histórias</Text>
            </View>
          </View>
          
          {/* Conteúdo principal da tela */}
          <View style={styles.screenContainer}>
            {/* Imagem e nome do perfil do usuário */}
            <View style={styles.profileImageContainer}>
              <Image
                source={require("../assets/profile_img.png")}
                style={styles.profileImage}
              ></Image>
              <Text style={styles.nameText}>{this.state.name}</Text>
            </View>
            
            {/* Seção de alternância de tema */}
            <View style={styles.themeContainer}>
              <Text style={styles.themeText}>Tema escuro</Text>
              <Switch
                style={{
                  transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }]
                }}
                trackColor={{ false: "#767577", true: "white" }}
                thumbColor={this.state.isEnabled ? "#ee8249" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => this.toggleSwitch()}
                value={this.state.isEnabled}
              />
            </View>
            
            {/* Espaçador */}
            <View style={{ flex: 0.3 }} />
          </View>
          
          {/* Preenchimento inferior */}
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

// Estilos para o componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  screenContainer: {
    flex: 0.85
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  profileImage: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70)
  },
  nameText: {
    color: "white",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans",
    marginTop: RFValue(10)
  },
  themeContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: RFValue(20)
  },
  themeText: {
    color: "white",
    fontSize: RFValue(30),
    fontFamily: "Bubblegum-Sans",
    marginRight: RFValue(15)
  }
});
