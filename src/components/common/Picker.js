import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import { Colors, Images } from '@themes';
export default function Picker({ getUserType }) {
    const [userType, setUserType] = useState(null)
    const userTypes = [
        {
            label: 'Home',
            value: '1',
        },
        {
            label: 'Office',
            value: '2',
        },
        {
            label: 'Others',
            value: '3',
        },
    ];
    const placeholder = {
        label: 'User Type',
        value: null,
        color: '#9EA0A4',
    };
    return (

        <View style={styles.inputView}>
            <View style={styles.pickerView}>
                <RNPickerSelect
                    placeholder={placeholder}
                    items={userTypes}
                    onValueChange={value => {
                        setUserType(value)
                        getUserType(value)
                    }}
                    style={{
                        ...pickerSelectStyles,
                        placeholder: {
                            color: 'grey',
                        },
                    }}
                    value={userType}
                    useNativeAndroidPickerStyle={false}

                />
            </View>
            <View style={styles.iconView}>
                <Image style={styles.icon} source={Images.icons.downArrow} />
            </View>
        </View>

    )
}
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        color: 'black',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 1.5,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingLeft: 0,
    },
    inputAndroid: {
        backgroundColor: 'transparent',
        fontSize: 16,
        color: 'black',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 1.5,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingLeft: 0,
    },
});
const styles = StyleSheet.create({
    inputView: {
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 0,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingLeft: 0,
    },
    textInputView: {
        //backgroundColor: '#ffffff',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 0,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 0,
        paddingLeft: 0,
    },
    pickerView: { flex: 0.9, justifyContent: 'center', },
    iconView: { flex: 0.1, justifyContent: 'center', },
    icon: { height: 20, width: 20, tintColor: "grey" }
});
