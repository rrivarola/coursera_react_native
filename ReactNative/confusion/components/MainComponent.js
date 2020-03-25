import React, { Component } from 'react';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import { DISHES } from '../shared/dishes';
import { View, Platform, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { createStackNavigator, createDrawerNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import Home from './HomeComponent';
import Contact from './ContactComponent';
import { YellowBox } from 'react-native'
import  About  from './AboutComponent'
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders } from '../redux/ActionCreators';
import Reservation from './ReservationComponent';


const mapStateToProps = state => {
  return {
  
  }
}

const mapDispatchToProps = dispatch => ({
  fetchDishes: () => dispatch(fetchDishes()),
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
})


const MenuNavigator = createStackNavigator({
  Menu: { screen: Menu,
    navigationOptions: ({ navigation }) => ({
      headerLeft: <Icon name="menu" size={24} 
      color= 'white'
      onPress={ () => navigation.toggleDrawer() } />          
    })  
   },
  About: { screen: About },
  DishDetail: { screen: DishDetail },
  Contact: { screen: Contact },

},
  {
    initialRouteName: 'Menu',
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#512DA8"
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        color: "#fff"
      }
    }
  }
);

YellowBox.ignoreWarnings([
  'DrawerLayoutAndroid drawerPosition',
  'Encountered an error loading page',    // WebView uri: result.url and url failing to load - "bloomberg suneq" https://github.com/facebook/react-native/issues/7839#issuecomment-224111608
  'Deprecation warning: moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
  'Task orphaned for request ',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.',
  'Remote debugger is in a background tab which may cause apps to perform slowly',
])



const HomeNavigator = createStackNavigator({
  Home: { screen: Home }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: "#512DA8"
    },
    headerTitleStyle: {
      color: "#fff"
    },
    headerTintColor: "#fff",
    headerLeft: <Icon name="menu" size={24}
        color= 'white'
        onPress={ () => navigation.toggleDrawer() } />    
  })
});

const ContactUsNavigator = createStackNavigator({
  Contact: { screen: Contact }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: "#512DA8"
    },
    headerTitleStyle: {
      color: "#fff"
    },
    headerTintColor: "#fff",
    headerLeft: <Icon name="menu" size={24}
    color= 'white'
    onPress={ () => navigation.toggleDrawer() } />    

  })
});

const AboutUsNavigator = createStackNavigator({
  About: { screen: About }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: "#512DA8"
    },
    headerTitleStyle: {
      color: "#fff"
    },
    headerTintColor: "#fff",
    headerLeft: <Icon name="menu" size={24}
    color= 'white'
    onPress={ () => navigation.toggleDrawer() } />    
  })
});

const ReservationNavigator = createStackNavigator({
  Reservation: { screen: Reservation }
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
        backgroundColor: "#512DA8"
    },
    headerTitleStyle: {
        color: "#fff"            
    },
    headerTintColor: "#fff",
    headerLeft: <Icon name="menu" size={24}
      iconStyle={{ color: 'white' }} 
      onPress={ () => navigation.navigate('DrawerToggle') } />    
  })
})

const CustomDrawerContentComponent = (props) => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <View style={styles.drawerHeader}>
        <View style={{flex:1}}>
        <Image source={require('./images/logo.png')} style={styles.drawerImage} />
        </View>
        <View style={{flex: 2}}>
          <Text style={styles.drawerHeaderText}>Ristorante Con Fusion</Text>
        </View>
      </View>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#512DA8',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  drawerHeaderText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  drawerImage: {
    margin: 10,
    width: 80,
    height: 60
  }
});

const MainNavigator = createDrawerNavigator({
  Home: {
      screen: HomeNavigator,
      navigationOptions: {
        title: 'Home',
        drawerLabel: 'Home',
        drawerIcon: ({ tintColor, focused }) => (
          <Icon
            name='home'
            type='font-awesome'            
            size={24}
            color={tintColor}
          />
        ),
      }
    },
  About:
  {
    screen: AboutUsNavigator,
    navigationOptions: {
      title: 'About Us',
      drawerLabel: 'About Us',
      drawerLabel: 'About Us',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
          name='info-circle'
          type='font-awesome'            
          size={24}
          color={tintColor}
        />
      ),
    },
  },
  Menu:
  {
    screen: MenuNavigator,
    navigationOptions: ({ navigation }) => ({
      title: 'Menus',
      drawerLabel: 'Menu',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
          name='list'
          type='font-awesome'            
          size={24}
          color={tintColor}
        />
      ), 
    })  
  },
  Contact:
  {
    screen: ContactUsNavigator,
    navigationOptions: {
      title: 'Contact Us',
      drawerLabel: 'Contact Us',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
          name='address-card'
          type='font-awesome'            
          size={22}
          color={tintColor}
        />
      ),
    },
  },
  Reservation:
  { screen: ReservationNavigator,
    navigationOptions: {
      title: 'Reserve Table',
      drawerLabel: 'Reserve Table',
      drawerIcon: ({ tintColor, focused }) => (
        <Icon
          name='cutlery'
          type='font-awesome'            
          size={24}
          iconStyle={{ color: tintColor }}
        />
      ),
    }
  }

},
  {
    drawerBackgroundColor: '#D1C4E9',
    contentComponent: CustomDrawerContentComponent
  });



class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dishes: DISHES,
      selectedDish: null
    };
  }

  
componentDidMount() {
  this.props.fetchDishes();
  this.props.fetchComments();
  this.props.fetchPromos();
  this.props.fetchLeaders();
}

  onDishSelect(dishId) {
    this.setState({ selectedDish: dishId })
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
        <MainNavigator />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);