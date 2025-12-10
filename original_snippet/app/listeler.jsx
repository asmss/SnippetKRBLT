import { router } from "expo-router";
import React ,{useState} from 'react';
import { View, Text, StyleSheet,FlatList,Alert,ActivityIndicator, ScrollView, TouchableOpacity,TouchableWithoutFeedback,Keyboard ,Button} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../context/authContext";
import {useSnippets} from "../context/snippetContext"

export default function listeler(){
const { snippets, loading ,fetchSnippets} = useSnippets();
const {token,user} = useAuth();
const [expandedId, setExpandedId] = useState(null);
const [seçili,setSeçili] =useState(null);


    const dön=()=>{
router.push("/(tabs)") }


const handleDelete =async(snippet)=>{
     const SnippetId = snippet._id;


     try {
            const res = await fetch(`https://snippetkrblt.onrender.com/api/snippets/${SnippetId}`,{
        method:"DELETE",
        headers:{
          'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`        
        }
    })
      const data = await res.json();
       if(res.ok)
       {
    Alert.alert("silindi","snippet başarıyla silindi")
    fetchSnippets();
    }else{
        Alert.alert("hata",data.message,"snippet silinemedi")
    }
     } catch (error) {
        console.error("beklenmedik bir hatayla karşılaşıldı",error)
     }

       

}
   
   if(loading){
         return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0aff9d" />
                <Text style={styles.loadingText}>Snippet'lar Yükleniyor...</Text>
            </SafeAreaView>
        );

   }
const renderSnippet = ({ item }) => {
    const isExpanded = item._id === expandedId; 
    
    const toggleExpand = () => {
        setExpandedId(isExpanded ? null : item._id);
    };

    return (
        <TouchableWithoutFeedback onPress={toggleExpand}>
            <View style={styles.snippetCard}>
                <Text style={styles.snippetTitle}>{item.title}</Text>
                <Text 
                    style={styles.snippetCode} 
                    numberOfLines={isExpanded ? undefined : 5} 
                >
                    {item.code}
                </Text>

                {!isExpanded && (
                     <Text style={styles.readMoreText}>
                        ... Detaylar için dokun
                    </Text>
                )}
                  {isExpanded && (
                    <View style={styles.actionContainer}>
                        <TouchableOpacity 
                             style={styles.deleteButton} 
                             onPress={() => handleDelete(item)} 
                        >
                             <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
                             <Text style={styles.deleteButtonText}>SİL</Text>
                        </TouchableOpacity>
                        <Text style={styles.readMoreText}>
                            ... Kapatmak için dokun 
                        </Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback> 
    );
};
return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollViewContent}>
               <View style={{flexDirection:"row",justifyContent:"space-between",paddingBottom:10}}>
                <Text style={styles.header}>LİSTEM ➲ KAYIT ➲ {snippets.length}</Text>
                <TouchableOpacity style={styles.anasayfa} >
             <Ionicons name="log-out-outline" size={20} color="white" onPress={()=>router.push("/(tabs)")}/>
          </TouchableOpacity>
          </View>
                {snippets.length === 0 ? (
                    <Text style={styles.emptyText}>Henüz hiç snippet kaydedilmemiş.</Text>
                ) : (
                    <FlatList
                        data={snippets}
                        renderItem={renderSnippet}
                        keyExtractor={item => item._id} 
                        scrollEnabled={false} 

                    />
                )}
                
            </ScrollView>
        </SafeAreaView>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D', 
    },
   anasayfa: { backgroundColor: '#333',padding:20,borderRadius: 80 },

    scrollViewContent: {
        flexGrow: 1, 
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 40, 
    },
readMoreText: {
        color: '#0aff9d', 
        marginTop: 8,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right', 
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#ff4d4d15',
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#ff4d4d',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0aff9d', 
        marginBottom: 25,
        textAlign: 'center',
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },

    emptyText: {
        color: '#777',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },

    snippetCard: {
        backgroundColor: '#1A1A1A', 
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 3, 
        borderColor: '#0aff9d',
        shadowColor: '#0aff9d',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    snippetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },

    snippetCode: {
        fontSize: 14,
        color: '#B0B0B0', 
    },
    
    buttonStyle: {
        padding: 15,
        backgroundColor: '#0aff9d22', 
        borderColor: '#0aff9d',
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    buttonText: {
        color: '#0aff9d',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});