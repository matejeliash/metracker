
import { Text, View } from "react-native";
import { Task } from "../db/db";
import { useTheme } from "../styles";


type Props = {
    tasks: Task[];

}

// functional versions of function to get  ratio and count of done tasks

// const getDoneTaskCount = (tasks:Task[]) =>{
//     return tasks.filter(task => task.done === 1).length

// }

// const getDoneTaskRatio = (tasks:Task[]) =>{
//     return tasks.length === 0 
//     ? 0 
//     : (getDoneTaskCount(tasks) /  tasks.length * 100).toFixed(2)




// }


// progress bar showing ration of finished and unfinished tasks

export const TaskProgress: React.FC<Props> = ({ tasks }) => {

    const { primaryColor,  styles } = useTheme();


    // can't use boolean because of sqlite
    const doneTaskCount = tasks.filter(task => task.done === 1).length
    const taskCount = tasks.length
    //  if no created tasks return 0 otherwise ration > 0 <=100
    const doneTaskRatio = taskCount === 0 ? 0 : (doneTaskCount / taskCount * 100)

    console.log(tasks)



    return (
        <View style={{ padding: 10 }}>
            <View style={styles.outerProgress}>
                <View style={{ width: `${doneTaskRatio}%`, backgroundColor: primaryColor, height: "100%", borderRadius: 10 }}>
                </View>

            </View>
            {/* print as 2 floating point string number */}
            <Text style={styles.text}>{`${doneTaskRatio.toFixed(2)}% done - ${doneTaskCount}/${taskCount}`}</Text>
        </View>

    )

}