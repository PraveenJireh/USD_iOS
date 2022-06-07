
import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    header: { height: 50 },
    search: { height: 64, backgroundColor: "white", paddingHorizontal: 0 },
    category: { flex: 1,flexDirection:'row',height:50,backgroundColor:"white", marginTop: 0, marginRight: 0,marginLeft:10 },
    labelView: {
        height: 35, width: 150, flexDirection: 'row',
        backgroundColor: "white",
        alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 5
    },
    gridIcon: {
        marginLeft: 10, height: 20, width: 20,
        tintColor: '#e4e4e4'
    },
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
    title: { fontWeight: 'bold', fontSize: 15 },
    qty: { 
        color: "black", 
        fontSize: 14, 
        marginTop: 5,
        flex:1,
        fontWeight:'bold'  
        },
    price: {
        fontWeight: 'bold', 
        fontSize: 15,
        marginTop: 5,
        color:"red"
    },
    text: { marginLeft: 10, fontSize: 16 },
    button: { marginTop: 0,marginStart:10,marginEnd:10,backgroundColor:"#fe5c45",borderRadius:25 },
    buttonWhite: { marginTop: 0,justifyContent:'center',alignItems:'center',height:50,marginStart:10,marginEnd:10,backgroundColor:"white",borderRadius:25 },
});