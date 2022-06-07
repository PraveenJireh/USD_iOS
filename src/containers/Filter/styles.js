import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window')
import { Colors } from "@themes";
export default StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fbfaf9" },
    header: { height: 50 },
    inputtitle: { marginVertical: 15, fontSize: 16, fontWeight: "bold" },
    input: {
        fontSize: 16, margin: 0,
        padding: 0
    },
    row: {
        marginRight: 10,
        flex:1,
        backgroundColor:"#f7f8fc",
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "lightgrey",
        elevation: 5,
        flexDirection:'row',
        // borderWidth: 1,
        borderRadius: 5,
        marginVertical: 5,
        padding: 10,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
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
        height:50
    },
    content: { flex: 1 },
    subContent: { marginHorizontal: 15, marginTop: 20 },
    list: { marginVertical: 20, height: 50 },
    button: { marginTop: 0,marginStart:10,marginEnd:10,backgroundColor:"#fe5c45",borderRadius:25 },
    buttonWhite: { marginTop: 0,justifyContent:'center',alignItems:'center',height:50,marginStart:10,marginEnd:10,backgroundColor:"white",borderColor:'red',borderWidth:1,borderRadius:25 },

    buttonTxt: { color: "white", fontWeight: "bold", fontSize: 16 },
    icon: { height: 18, width: 18, tintColor: Colors.theme },
    title: { marginLeft: 0 }
});