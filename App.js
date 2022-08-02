import React, { useState, useMemo, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Navigation from '@Navigation'
import SplashScreen from 'react-native-splash-screen'
import { UserContext } from '@context/user-context';
import { NotificationContext } from '@context/notification-context';
import { CartContext } from '@context/cart-context';
import { TokenContext } from '@context/token-context';
import linking from "./src/linking";
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from "react-native-push-notification";
import { useNavigation } from '@react-navigation/native';
import { NavigationActions } from "react-navigation";
const App = () => {

  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cartCount, setCartCount] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [notificationAndroid, setNotificationAndroid] = useState(null);
  const userValue = useMemo(() => ({ user, setUser }), [user, setUser]);
  const notificationValue = useMemo(() => ({ notification, setNotification }), [notification, setNotification]);
  const cartCountValue = useMemo(() => ({ cartCount, setCartCount }), [cartCount, setCartCount]);
  const tokenValue = useMemo(() => ({ fcmToken, setFcmToken }), [fcmToken, setFcmToken]);


  const [hideSplash, setHideSplash] = React.useState(false);
  const checkToken = async () => {
    const fcm_token = await messaging().getToken();
    if (fcm_token) {
      console.log(fcm_token, "hhhhhhhhhh");
      setFcmToken(fcm_token)
    }
  }
  useEffect(() => {
    checkToken()
  }, [])

  React.useEffect(() => {
    setTimeout(() => {
      setHideSplash(true);
    }, 1200); // amount of time the splash is shown from the time component is rendered
  }, []);

  //const navigation = useNavigation();

  const showNotification = notification => {
    setNotificationAndroid(notification.data);
    //console.log(notification.data)
    PushNotification.localNotification({
      title: notification.title,
      message: notification.body,
      foreground: true,
      largeIcon: "ic_launcher",
      bigLargeIcon: "ic_launcher",
      userInteraction: true,
      requestPermissions: true,
      channelId: notification.data.notificationType === "1" ? "my-channel" : "fcm_fallback_notification_channel"
    });
  };

  useEffect(() => {
    hideSplash && SplashScreen.hide();

    PushNotification.configure({
      largeIcon: "logo1",
      smallIcon: "logo1",
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      onNotification: function (notification) {

        if (notification.userInteraction) {
          // Handle notification click
          NavigationActions.navigate("Home")
          console.log(notification.title)
        }
        //const { data } = notification;

        //console.log(data)

        // if(data.data.notificationType === "1"){
        //   Navigation.navigate('Home');
        // }

        //NavigationService.navigate('Home');
      }
    });

    // messaging()
    //   .getInitialNotification()
    //   .then(response => {
    //     console.log('Message handled in the getInitialNotification!', response);
    //     if (response) showNotification(response);
    //   });

    // messaging().onNotificationOpenedApp(async remoteMessage => {
    //   console.log('Message handled in the quit state!', remoteMessage);
    //   showNotification(remoteMessage);
    // });

    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   // When app in foreground
    //   console.log('Message handled in the foregroud!', remoteMessage);
    //   showNotification(remoteMessage);
    // });

    PushNotification.createChannel(
      {
        channelId: "my-channel", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: false, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );

    // return () => {
    //   return unsubscribe;
    // };

  }, [hideSplash])

  return (
    <>
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        <UserContext.Provider value={userValue}>
          <TokenContext.Provider value={tokenValue}>
            <NotificationContext.Provider value={notificationValue}>
              <CartContext.Provider value={cartCountValue}>
                <Navigation />
              </CartContext.Provider>
            </NotificationContext.Provider>
          </TokenContext.Provider>
        </UserContext.Provider>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
