import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { TaskItem } from "../components/TaskItem";
import { TaskModal } from "../components/TaskModal";
import { TaskProgress } from "../components/TaskProgress";
import { createTable, deleteTask, getTodayTasks, insertTask, maybeCopyTasksFromLastDate, Task, updateTaskTitle } from "../db/db";
import { useTheme } from "../styles";

export default function Index() {


  const {
    backgroundColor,
    textColor,
    styles
  } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<Task>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // create tasks table, copy tasks from last used date if date exists
  const loadTasks = async () => {
    try {
      await createTable();
      await maybeCopyTasksFromLastDate();
      const data = await getTodayTasks();
      setTasks(data);

    } catch (err: any) {
      console.log(err)
    }
  }

  // do on screen load
  useEffect(() => {
    try {
      loadTasks()
    } catch (err: any) {
      Alert.alert(err.message)
    }


  }, []);


  const storeTask = async () => {
    const trimmedTitle = taskTitle.trim()

    // do not allow empty / only whitespace titles
    if (trimmedTitle === "") {
      Alert.alert("Empty task title", "Task title cannot be empty.")
      return;
    }
    // save tasks and retrieve todays tasks
    insertTask(taskTitle);
    const gotTasks = await getTodayTasks();
    setTasks(gotTasks);
    setTaskTitle(""); // clean input field
  }


  // select task and show modal
  const afterTaskPress = (task: Task) => {
    setSelectedTask(task);
    setIsModalVisible(true);


  }

  const closeModal = () => {
    setIsModalVisible(false);
  }




  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View style={styles.container}
      >
        <TextInput style={styles.taskInput}
          value={taskTitle}
          onChangeText={setTaskTitle}
          placeholder="Type task title here ..."
          placeholderTextColor={textColor}
        >
        </TextInput>



        <Pressable style={styles.button} onPress={storeTask}>

          <Ionicons name={'add-outline'} color={textColor} size={28} />
          <Text style={styles.text} >{"Add task"}</Text>
        </Pressable>

        <Text style={styles.h2}>Tasks:</Text>

        <TaskProgress tasks={tasks}></TaskProgress>

        {/* use margin so tasks are not covered by tabs */}
        <FlatList style={{ marginBottom: 170 }}
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {

            return <Pressable style={styles.taskContainer} onPress={() => afterTaskPress(item)}>
              <TaskItem task={item} reload={loadTasks}>

              </TaskItem>

            </Pressable>
          }}
        >

        </FlatList>

        {/* only show modal when task is selected */}
        {selectedTask &&
          <TaskModal
            task={selectedTask}
            isVisible={isModalVisible}
            onClose={closeModal}
            onSave={updateTaskTitle}
            onDelete={deleteTask}
            loadTasks={loadTasks}
          >

          </TaskModal>}





      </View>
    </View>
  );
}

