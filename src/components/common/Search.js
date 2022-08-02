import React from 'react'
import { View, Text, Image, TextInput, StyleSheet } from 'react-native'
import { Colors, Images } from '@themes';
export default function Search() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Image source={Images.icons.search} style={styles.icon} />
                <TextInput
                    placeholder="Search here..."
                    style={styles.input}
                    placeholderTextColor="grey"
                // onChangeText={(text)=>onSearch(text)} 
                />
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, marginTop: 5 },
    content: { flexDirection: 'row',
        backgroundColor: "white", borderRadius: 5,
        alignItems: 'center', paddingLeft: 10,backgroundColor:'#f7f8fc',height:50
    },
    icon: { height: 18, width: 18, tintColor: "grey" },

    input: { flex:1,marginLeft: 10, margin: 0, padding: 0 }
});