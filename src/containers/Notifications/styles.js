
import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    header: { height: 50 },
    content: { flex: 1, },
    row: {
        shadowOpacity: 0.5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "grey",
        elevation: 5,
        backgroundColor: "white",
        padding: 15,
        marginBottom: 10,
        marginTop:10,
        marginHorizontal: 10,
        borderRadius: 5,

    },
    rowContent: { flexDirection: 'row', justifyContent: "space-between", },
    title: { fontWeight: 'bold' },
    time: { color: "grey", fontSize: 12, },
    pinIcon: { height: 20, width: 20,tintColor:"red" },
    desc: { color: "dimgrey", fontSize: 12, marginTop: 5 }
});