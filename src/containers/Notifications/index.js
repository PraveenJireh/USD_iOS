import React,{useState,useEffect} from 'react'
import { View, Text, FlatList,Image,BackHandler,ActivityIndicator } from 'react-native'
import { Header } from "@components";
import { Constants,Images } from "@themes";
import styles from './styles';
import Services from "@Services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function Notifications() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [data, setData] = useState(null);
    const [userId, setUserId] = useState(0);
    const [userRole, setUserRole] = useState(0);
    const [notificationData, setNotificationData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getData()

        const backAction = () => {
            navigation.pop()
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
      }, [isFocused])

    const getData = async () => {
        try {
          const user_id = await AsyncStorage.getItem('@USER_ID')
          if(user_id !== null) {
            setUserId(user_id),
            getUserData(user_id),
            getNotificationList(user_id),
            updateNotification(user_id)
          }
        } catch(e) {
        }
      }
      
      function getUserData(user_id) {
        if(user_id !== null) {
          Services(Constants.API_BASE_URL + "get_user_details", {'user_id':user_id},"POST")
          .then((response) => {
              if(response.status === 1){
                  setData(response.data)
                  setUserRole(response.data.role)
              }else{
              }
          })
        }
    }

    function getNotificationList(user_id) {
      if(user_id !== null) {
          setLoading(true);
        Services(Constants.API_BASE_URL + "get_all_notification", {'user_id':user_id},"POST")
        .then((response) => {
            if(response.status === 1){
                setNotificationData(response.notificationDetails)
                setLoading(false);
            }else{
                setLoading(false);
            }
        })
      }
  }

  function updateNotification(user_id) {
    if(user_id !== null) {
      Services(Constants.API_BASE_URL + "update_notification", {'user_id':user_id},"POST")
      .then((response) => {
          if(response.status === 1){
          }else{
          }
      })
    }
}

    function _renderItem({ item, index }) {
        return (
            <View style={[styles.row, { marginTop: index === 0 ? 10 : 0 }]}>
                <View style={styles.rowContent}>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                <Text style={{ color: "#cccccc", fontSize: 12, marginTop: 5}} numberOfLines={1}>{item.created_at}</Text>
                <Text style={styles.desc}>{item.message}</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Notification" />
            </View>

            {loading ? (
                <ActivityIndicator
                    color='black'
                    size='large'
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    />
            ) : (
                <View style={styles.content}>

                    {notificationData.length != 0 ? (
                        <FlatList
                            data={notificationData}
                            renderItem={_renderItem}
                            keyExtractor={item => item.id}
                        />

                        ) : (
                            <View style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}>
                                <Text style={{justifyContent:'center',fontWeight:'bold',fontSize:16,color:'black',alignSelf:'center',textAlign: "center" }}>No Notifications.</Text>
                            </View>
                        )}
                </View>
            )}
            
        </View>
    )
}
