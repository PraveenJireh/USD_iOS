import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: {
        flex: 1, backgroundColor: "#fbfaf9"
    },
    header: { height: 50,flexDirection: "row", backgroundColor: "#eef1fc" },
    content: { flex: 1, },
    row: {
        flexDirection: 'row',
        padding: 20,
        borderBottomWidth: 1,
        borderColor: Colors.e4e4e4
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
    }
});