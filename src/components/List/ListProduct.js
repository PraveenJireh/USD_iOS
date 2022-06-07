import React from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { Constants, Colors,Images } from '@themes';
import { useNavigation } from '@react-navigation/native';
export default function ListProduct() {
    const navigation = useNavigation();
    function _renderItem({ item, index }) {
        return (
            <View style={{flex:1,padding:10}}>
     <TouchableOpacity style={[styles.row]} onPress={() => navigation.push("ProductDetails")}>

                    <View style={{flex:1,flexDirection:'row'}}>
                        <View style={{flexDirection:'row',backgroundColor:'white',alignSelf:'center',borderRadius:4,padding:5}}>
                            <Text style={{color:'orange',size:13}}>2</Text>
                            <Image style={{width:15,height:15,marginLeft:8,tintColor:'orange',alignSelf:'center'}} source={Images.icons.star}/>
                            
                        </View>

                        <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                        <Image style={{width:20,height:20,marginLeft:8,tintColor:'lightgrey',alignSelf:'center'}} 
                        source={Images.icons.heart}/> 
                        </View>
                    </View>

                <Image source={{ uri: item.thumbnail }} style={styles.img} resizeMode="contain" />
                <Text style={styles.title}>{item.product_name}</Text>
                
                <View style={{flex:1,flexDirection:'row'}}>
                <Text style={{flex:1,fontSize: 14,fontWeight: "normal",marginTop: 15,
                                color: "red",}}>{'\u20B9'}{" "}{item.discount_price}</Text>

                <Text style={{flex:1,fontSize: 14,fontWeight: "normal",marginTop: 15,textDecorationLine: 'line-through', textDecorationStyle: 'solid',
                                color: "grey",alignSelf:'flex-end',alignContent:'flex-end'}}>{'\u20B9'}{" "}{item.price}</Text>
                </View>
            
            </TouchableOpacity>
            </View>
            
        )
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={Constants.LIST_PRODUCTS}
                renderItem={_renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                columnWrapperStyle={{justifyContent:'space-between', }}
                showsHorizontalScrollIndicator={false}
                style={{marginTop:10,padding:10}}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: { marginTop: 0, },
    row: {
        backgroundColor:"#f7f8fc",
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "lightgrey",
        elevation: 5,
        flex:1,
        borderRadius: 5,
        padding: 10,
    
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#191e1f",
        marginTop: 5
    },
    img: { height: 150, width: 130,alignSelf:'center',top:8 },
    subTxt: {
        flex:1,
        fontSize: 10,
        fontWeight: "bold",
        marginTop: 15,
        color: "#3ec751",
        alignSelf:'center'
    },
    content: {
        flexDirection: 'row', 
        justifyContent: "space-between", 
        marginHorizontal: 15,
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