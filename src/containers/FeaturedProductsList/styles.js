
import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    row: {
        //backgroundColor:"#f7f8fc",
        backgroundColor:"white",
        shadowOpacity: 0,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "lightgrey",
        elevation: 0,
        flex:1,
        borderRadius: 0,
        padding: 0,
    
    },
    header: { height: 50 },
    search: { height: 64, backgroundColor: "white", paddingHorizontal: 0 },
    category: {flexDirection:'row',height:50,backgroundColor:"white", marginTop: 0, marginRight: 0,marginLeft:10 },
    labelView: {
        height: 35, width: 150, flexDirection: 'row',
        backgroundColor: "white",
        alignItems: 'center',
        // justifyContent: 'center',
        borderRadius: 0
    },
    gridIcon: {
        marginLeft: 10, height: 20, width: 20,
        tintColor: '#e4e4e4'
    },
    img: { height: 150, width: 130,alignSelf:'center',marginTop:8,marginBottom:0 },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#191e1f",
        marginTop: 0,
        height:40
    },
    text: { marginLeft: 10, fontSize: 16 },
    itemInvisible: {
        backgroundColor:'transparent',
        flex:1
    }
});