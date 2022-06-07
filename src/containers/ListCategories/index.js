import React,{useState,useEffect} from 'react'
import { View, Text, FlatList, TouchableOpacity,BackHandler, Image } from 'react-native'
import { Header } from "@components";
import { Constants, Images, Colors } from "@themes";
import styles from './styles';
import Services from "@Services";
import { useNavigation } from '@react-navigation/native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
export default function ListCategories() {

    const [data, setData] = useState([]);
    //const [userId, setUserId] = userId;
    var userId;
    var userType;
    const navigation = useNavigation();
    //console.log(data);
    useEffect(() => {
        getData()

        const backAction = () => {
            // Alert.alert("Urban Stop Design", "Are you sure you want to Exit USD App?", [
            //   {
            //     text: "Cancel",
            //     onPress: () => null,
            //     style: "cancel"
            //   },
            //   { text: "YES", onPress: () => BackHandler.exitApp() }
            // ]);
            navigation.pop()
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
      }, [])

    const getData = async () => {
        Services(Constants.API_BASE_URL + "/category","GET")
            .then((response) => {
                //console.log("Categoriessss",response.data);
                if(response.status === 1){
                    setData(response.data)
                }else{
                    alert(response.msg)
                }
            })
      }

      const categoryNavigation = async (item) => {
        navigation.navigate("ListScreen", {
          categoryId: item.id
        });
      }

    function _renderItem({ item, index }) {
        return (
            <TouchableOpacity onPress={categoryNavigation.bind(this, item)}>
            <View style={styles.row}>
                <View style={{ flex: 0.3, }}>
                    <Image source={{ uri: item.image }}
                        style={{ height: 80, width: 80 }} resizeMode="contain" />
                </View>
                <View style={{ flex: 0.7 }}>
                    <Text style={styles.title}>{item.category}</Text>
                    <Text style={{color:"#cccccc",marginTop: 10,fontWeight:'bold'}}>{item.items_count}{" "}{"Itmes"}</Text>
                
                </View>
            </View>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Categories" />
            </View>
            <View style={styles.content}>
                <FlatList
                    data={data}
                    renderItem={_renderItem}
                    keyExtractor={item => item.id}
                />
            </View>
        </View>
    )
    }