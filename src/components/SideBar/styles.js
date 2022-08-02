
import { StyleSheet } from 'react-native';
import { Colors } from "@themes";

export default StyleSheet.create({
    container: { flex: 1, backgroundColor: "white", },
    headerView: { flex: 0.1, justifyContent: 'center', alignItems: 'flex-end' },
    closeIconView: {
        height: 35, width: 35,
        backgroundColor: "white", borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 15
    },
    closeIcon: { height: 40, width: 40, tintColor: Colors.theme },
    nameView: { flex: 0.35, justifyContent: 'center',marginLeft: 0 },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        color: "black",
        marginLeft: 15,
        marginTop:8
    },
    listView: { flex: 0.85,backgroundColor:"white" },
    row: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 15,
        alignItems: 'center'
    },
    icon: { height: 20, width: 20, tintColor: "grey" },
    title: {
        fontSize: 14,
        fontWeight: "bold",
        color: "grey",
        marginLeft: 15
    },
    profileView: {marginTop:10, flexDirection: 'row', alignItems: 'center',alignSelf:'center' },
    emptyImg: { height: 120, width: 120, marginLeft: 0, borderRadius: 60 },
    profilePic: { height: 120, width: 120, marginLeft: 0, borderRadius: 60 },
});