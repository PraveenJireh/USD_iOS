import React,{useState} from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { Constants, Colors,Images } from '@themes';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
export default function HotSale({data}) {
    const navigation = useNavigation();
    const [fcmTokenValue,setFcmToken] = useState('');

    const checkToken = async () => {
     const fcmToken = await messaging().getToken();
     if (fcmToken) {
         setFcmToken(fcmToken)
       //console.log(fcmToken);
     } 
    }
    const productNavigation = async (item) => {
        const fcmToken = await messaging().getToken();
            if (fcmToken) {
                setFcmToken(fcmToken)
                navigation.navigate("ProductDetails", {
                productId: item.id,
                productURL:item.base_url,
                orderRating:"",
                fcmTokenValue:fcmToken
                });
            }
        // navigation.navigate("ProductDetails", {
        //   productId: item.id,
        //   productURL:item.base_url,
        //   orderRating:"",
        //   fcmTokenValue:fcmTokenValue
        // });
      }

    function _renderItem({ item, index }) {
        return (
            <View style={{flex:1,padding:0,borderColor:'#cccccc',borderWidth:0.5}}>
    <TouchableOpacity style={[styles.row]} onPress={productNavigation.bind(this, item)}>

            <View style={{flex:1,height:250,width:190,backgroundColor:'#f7f8fc',padding:5}}>
                <FastImage source={{ uri: item.thumbnail }} style={{flex:1,width: null, height: null,resizeMode:'stretch'}} resizeMode="contain">

                </FastImage>
            </View>

            <View style={{backgroundColor:'white',padding:5}}>
              <Text 
              numberOfLines={2}
              style={styles.title}>{item.product_name}</Text>

              <View style={{flexDirection:'row',marginTop:4}}>
                      <Text style={{fontSize: 14,fontWeight: "bold",color: "orange"}}>
                        Design No : 
                      </Text>

                      <Text style={{fontSize: 14,fontWeight: "bold",color: "black"}}>
                        {item.sku}
                      </Text>
                    </View>
              
              <View style={{flex:1,flexDirection:'row',marginTop:8,alignItems:'center'}}>
              <Text style={{fontSize: 14,fontWeight: "bold",marginTop: 0,
                              color: "red",}}>{'\u20B9'}{" "}{item.discount_price}</Text>

              <Text style={{fontSize: 14,marginStart:15,fontWeight: "bold",marginTop: 0,textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                              color: "grey",alignSelf:'flex-end',alignContent:'flex-end'}}>{'\u20B9'}{" "}{item.price}</Text>
                <View style={{width:1,height:10,backgroundColor:'lightgrey',marginStart:15,marginEnd:15}}/>

                <View style={{flexDirection:'row',alignSelf:'center',borderRadius:0,padding:0}}>
                        <Text style={{color:'orange',fontSize:12}}>{item.rating}</Text>
                        <Image style={{width:12,height:12,marginLeft:8,tintColor:'orange',alignSelf:'center'}} source={Images.icons.star}/>
                        
                    </View>
              </View>
            </View>
        </TouchableOpacity>
        </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text1}>Hot Sale</Text>
                <TouchableOpacity style={styles.text2} onPress={() => navigation.push("HotSale")}>
                <Text style={styles.text2}>Show All</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={data}
                renderItem={_renderItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{marginTop:10}}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { marginTop: 20, },
    row: {
        marginRight: 0,
        backgroundColor:"white",
        shadowOpacity: 0,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "lightgrey",
        elevation: 0,
        // borderWidth: 1,
        borderRadius: 0,
        marginVertical: 0,
        padding: 0
    },
    // row: {
    //     marginRight: 15,
    //     backgroundColor:"white",
    //     shadowOpacity: 0.5,
    //     shadowOffset: { width: 1, height: 1 },
    //     shadowColor: "lightgrey",
    //     elevation: 5,
    //     // borderWidth: 1,
    //     borderRadius: 5,
    //     marginVertical: 10,
    //     padding: 10
    // },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#191e1f",
        marginTop: 0,
        height:40
    },
    img: { height: 150, width: 130,alignSelf:'center',marginTop:5 },
    subTxt: {
        fontSize: 10,
        fontWeight: "bold",
        marginTop: 15,
        color: "#3ec751",
    },
    content: {
        flexDirection: 'row', 
        justifyContent: "space-between", 
        marginHorizontal: 10,
        alignItems: "center"
    },
    text1: {
        fontSize: 16,
        fontWeight: "bold",
        color: "red"
    },
    text2: {
        fontSize: 12,
        fontWeight: "bold",
        color: "grey"
    }
});