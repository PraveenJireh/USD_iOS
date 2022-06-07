import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import { Header } from "@components";
import { Constants, Images, Colors } from "@themes";
import styles from './styles';
import { LinearGradientButton, Picker } from "@common";
import { useNavigation } from '@react-navigation/native';
export default function MyAddress() {
    const navigation = useNavigation();
    function _renderItem({ item, index }) {
        return (
            <View style={[styles.row, { marginTop: index === 0 ? 10 : 0 }]}>
                <View style={styles.rowView}>
                    <Text style={styles.title}>Home</Text>
                    <View style={styles.iconsView}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Image source={Images.icons.delete} style={[styles.icon, { tintColor: 'red' }]} />
                        </TouchableOpacity>
                    </View>

                </View>
                <Text style={styles.address} numberOfLines={2}>{item.desc}</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Shipping Address" />
            </View>
            <View style={{flex:1}}>
            <View style={styles.content}>
                <FlatList
                    data={Constants.NOTIFICATIONS}
                    renderItem={_renderItem}
                    keyExtractor={item => item.id}
                //style={{ marginTop: 10 }}
                />
            </View>
            </View>
            <View style={{flex:0.20,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
            <View style={{flex:1,marginTop: 20,backgroundColor:"#fe5c45",borderRadius:25,marginStart:30,marginEnd:30}}>
                <LinearGradientButton title="ADD ADDRESS" onPress={() => navigation.push("AddAddress")} />
            </View>
            </View>
        
        </View>
    )
}
