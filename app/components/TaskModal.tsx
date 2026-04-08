
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { Task } from "../db/db";
import { useTheme } from "../styles";


type Props = {
    isVisible: boolean;
    task: Task;
    onClose: () => void;
    onSave: (id: number, title: string) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    loadTasks: () => Promise<void>;
};


export const TaskModal: React.FC<Props> = ({ isVisible, task, onClose, onSave, onDelete, loadTasks }) => {

    const { primaryColor,
        backgroundColor,
        textColor,
        styles
    } = useTheme();



    const [title, setTitle] = useState<string>(task.title);

    useEffect(() => {
        setTitle(task.title);
    }, [task]);


    const handleSave = async () => {

        const trimmed = title.trim();
        if (!trimmed) {
            Alert.alert("Empty task title", "Task title cannot be empty.")
            return;
        }

        await onSave(task.id, title)
        await loadTasks();
        onClose();

    }

    const handleDelete = async () => {


        await onDelete(task.id)
        await loadTasks();
        onClose();

    }








    return (

        <Modal visible={isVisible} animationType="fade" transparent={true} style={styles.modal}  >

            {/* use whole screen and center */}
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.7)", //make background dim

                }
                }

            >

                {/* because of center it will use just needed height and precise with 80% */}
                <View style={{
                    backgroundColor: backgroundColor,
                    padding: 10,
                    width: "80%",
                    borderRadius: 20,
                    borderColor: primaryColor,
                    // borderWidth: 1,
                    shadowColor: primaryColor


                }}>


                    <Text style={styles.h2}>Edit selected task</Text>

                    <View style={{ height: 30 }}></View>
                    <TextInput style={styles.taskInput}
                        value={title}
                        onChangeText={setTitle}
                    >
                    </TextInput>

                    <View style={{ height: 50 }}></View>

                    {/* add button with space between them */}

                    <Pressable style={styles.button} onPress={handleSave}>
                        <Ionicons name={'save'} color={textColor} size={28} />
                        <Text style={styles.text} >Save</Text>
                    </Pressable>

                    <View style={{ height: 30 }}></View>


                    <Pressable style={styles.button} onPress={handleDelete}>
                        <Ionicons name={'trash'} color={textColor} size={28} />
                        <Text style={styles.text} >Delete</Text>
                    </Pressable>
                    <View style={{ height: 30 }}>

                    </View>
                    <Pressable style={styles.button} onPress={onClose}>
                        <Ionicons name={'close'} color={textColor} size={28} />
                        <Text style={styles.text} >Close</Text>
                    </Pressable>

                </View>
            </View>
        </Modal>
    )



}