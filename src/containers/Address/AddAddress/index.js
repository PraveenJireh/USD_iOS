import React from 'react'
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native'
import { Header } from "@components";
import { Content } from "native-base";
import { Constants, Images, Colors } from "@themes";
import styles from "./styles";
import { LinearGradientButton,Picker } from "@common";
import RNPickerSelect from 'react-native-picker-select';

export default function AddAddress() {
    function getUserType(value) {
        console.log(value, "-------")
    }
    function _renderItem({ item, index }) {
        return (
            <View style={[styles.row, { marginLeft: index === 0 ? 15 : 0, justifyContent: index === 0 ? "flex-start" : index === 1 ? "center" : 'flex-end', }]}>
                <Image source={Images.icons.unCheck} style={styles.icon} />
                <Text style={styles.title}>{item.title}</Text>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header title="Add Address" />
            </View>
            <Content>
                <View style={styles.content}>
                    <View style={styles.subContent}>

        <Text style={{marginVertical: 5, fontSize: 16, fontWeight: "bold"}}>Select Address Type</Text>
        
        {/* <View style={styles.textInputView}> */}
        <Picker getUserType={getUserType} />
        {/* </View> */}
                        
            <Text style={styles.inputtitle}>Address</Text>
        
            <View style={styles.textInputView}>
            <TextInput
                placeholder="Enter Complete Address"
                style={{fontSize: 16, 
                    margin: 0,
                    padding: 0}}
                placeholderTextColor="grey"
                keyboardType = "default" />
            </View>
            <Text style={styles.inputtitle}>City</Text>
        
            <View style={styles.textInputView}>
                <TextInput
                    placeholder="Enter City Name"
                    style={{fontSize: 16, 
                        margin: 0,
                        padding: 0}}
                    placeholderTextColor="grey"
                    keyboardType = "default" />
            </View>
            <Text style={styles.inputtitle}>State</Text>
        
            <View style={styles.textInputView}>
                <TextInput
                    placeholder="Enter State Name"
                    style={{fontSize: 16, 
                        margin: 0,
                        padding: 0}}
                    placeholderTextColor="grey"
                    keyboardType = "default" />
            </View>
            <Text style={styles.inputtitle}>Postal Code</Text>
        
            <View style={styles.textInputView}>
                <TextInput
                    placeholder="Enter Postal Code"
                    style={{fontSize: 16, 
                        margin: 0,
                        padding: 0}}
                    placeholderTextColor="grey"
                    keyboardType = "number-pad" />
            </View>
                    </View>

                    <View style={{flex:1,marginTop: 25,backgroundColor:"#fe5c45",borderRadius:25,marginStart:30,marginEnd:30}}>
                <LinearGradientButton title="SAVE ADDRESS" />
            </View>
                </View>
            </Content>
        </View>
    )
}
