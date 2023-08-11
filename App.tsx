import React,{useState,useEffect} from "react";
import { StyleSheet, Text, View, StatusBar,SafeAreaView,Button,TextInput,TouchableOpacity,FlatList,Alert} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"
const COLORS={primary:"#1f145c",white:"#fff"}
import AsyncStorage from '@react-native-async-storage/async-storage';

const App=()=>{
const [textInput,setTextInput]=useState('');
const [todos,setTodos]=useState([]);
useEffect(()=>{
    getTodos();
},[])
useEffect(()=>{
    saveToDoTouserDevice(todos);
},[todos]);

const ListItem=({todo})=>{
    return <View style={styles.listItem}>
        <View style={{flex:1}}><Text style={{fontWeight:'bold',fontSize:15,color:COLORS.primary,
        textDecorationLine:todo?.completed?"line-through":"none"}}>
        {todo?.task}</Text></View>
        {
            !todo?.completed && (
                <TouchableOpacity style={[styles.actionIcon]} onPress={()=>markTodoComplete(todo?.id)}>
                    <Icon name='done' size={20} color={COLORS.white} /></TouchableOpacity>
            )
        }
        <TouchableOpacity style={[styles.actionIcon],{backgroundColor:'red'}} onPress={()=> deleteTodo(todo?.id)}>
                <Icon name='delete' size={20} color={COLORS.white}/></TouchableOpacity>
    </View>;

}
    const saveToDoTouserDevice = async todos =>{
        try{
            const stringifyTodos=JSON.stringify(todos);
            await AsyncStorage.setItem('todos',stringifyTodos);
        } catch (e){
            console.log(e)
        }

    };
    const getTodos=async()=>{
        try{
            const todos=await AsyncStorage.getItem('todos');
            if(todos !=null){
                setTodos(JSON.parse(todos));
            }
        }catch(error){
            console.log(error)
        }

    }
    const addTodo=()=>{
        if(textInput.length==""){
            Alert.alert("Error","Please first add the task");
        }else{
        const  newTodo={
            id: Math.random(),
            task:textInput,
            completed:false
        };

            setTodos([...todos,newTodo]);
            setTextInput('');
        }
    };

    const markTodoComplete=(todoId)=>{
        const newTodos=todos.map((item)=>{
            if(item.id==todoId){
                return {...item,completed:true};
            }
            return item;
        });
        setTodos(newTodos);
    };

    const deleteTodo=(todoId)=>{
        const newTodos =todos.filter(item=>item.id!=todoId);
        setTodos(newTodos);
    };
    const clearTodo=()=>{
    if(todos.length==""){
        Alert.alert("Error","No Todos found")
    }else{
    Alert.alert("Are you sure?","",[
        {text:"Yes",
         onPress:()=>setTodos([]),
        },
        {text:"No"
        },
    ])
    }
    }
    return(
        <SafeAreaView style={{flex:1,backgroundColor:COLORS.white}}>
            <View style={styles.header}>
                <Text style={{fontWeight:"bold",fontSize:20,color:COLORS.primary}}>
                    TODO App
                </Text>
                <Icon name={"delete"} color={'red'}size={25} onPress={clearTodo}/>
            </View>
            <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{padding:20,paddingBottom:100}}
            data={todos} renderItem={({item})=><ListItem todo={item}/>}/>
            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput placeHolder="Add To Do"
                    value={textInput}
                    onChangeText={(text)=>setTextInput(text)}/>
                </View>
                <TouchableOpacity onPress={addTodo}>
                    <View style={styles.iconContainer}>
                        <Icon name='add' color={COLORS.white} size={30}/>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
const styles=StyleSheet.create({
    actionIcon:{
    height:25,
    width:25,
    backgroundColor:"green",
    justifyContent:'center',
    alignItems:'center',
    marginLeft:4,
    borderRadius:3,
    marginRight:5
    },
    listItem:{
        padding:20,
        backgroundColor:"white",
        flexDirection:'row',
        elevation:12,
        borderRadius:7,
        marginVertical:10,
    },
    header:{
        padding:20,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    footer:{
        position:"absolute",
        bottom:0,
        color:COLORS.white,
        width:"100%",
        flexDirection:"row",
        alignItems:'center',
        paddingHorizontal:20,
    },
    inputContainer:{
        backgroundColor:COLORS.white,
        elevation:40,
        flex:1,
        height:50,
        marginVertical:20,
        marginRight:20,
        borderRadius:30,
        paddingHorizontal:20,
    },
    iconContainer:{
        height:50,
        width:50,
        backgroundColor:COLORS.primary,
        elevation:40,
        borderRadius:25,
        justifyContent:'center',
        alignItems:'center'
    }
});


export default App;