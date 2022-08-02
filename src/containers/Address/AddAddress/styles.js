import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window')
import { Colors } from "@themes";
export default StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fbfaf9" },
    header: { height: 64 },
    inputView: {
        height: 40,
        backgroundColor: '#ffffff',
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "grey",
        elevation: 5,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingLeft: 20,
    },
    inputtitle: { marginVertical: 15, fontSize: 16, fontWeight: "bold" },
    input: {
        margin: 0,
        padding: 0,
    },
    row: {
        width: width / 3.3,
        flexDirection: 'row',
        // backgroundColor: "orange",

    },
    textInputView: {
        //backgroundColor: '#ffffff',
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowColor: "grey",
        elevation: 0,
        marginTop: 0,
        borderRadius: 0,
        borderBottomWidth : 1.5,
        borderBottomColor:"#e2e2e2",
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingLeft: 20,
    },
    content: { flex: 1 },
    subContent: { marginHorizontal: 15, marginTop: 20 },
    list: { marginVertical: 20, height: 50 },
    button: {
        height: 35, width: 150, backgroundColor: Colors.theme,
        alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
        borderRadius: 5
    },
    buttonTxt: { color: "white", fontWeight: "bold", fontSize: 16 },
    icon: { height: 18, width: 18, tintColor: Colors.theme },
    title: { marginLeft: 10 }
});