import { Checkbox } from 'expo-checkbox';
import { useState } from "react";
import { Text, View } from "react-native";
import { Task, updateTaskDone } from "../db/db";


import { useTheme } from "../styles";


type Props = {
    task: Task;
    reload: () => void;
}

// taskItem is task title + [x]
export const TaskItem: React.FC<Props> = ({ task, reload }) => {

    const {
        primaryColor,
        styles
    } = useTheme();

    const [isChecked, setChecked] = useState(task.done == 1 ? true : false);

    // this toggles task completion
    const toggle = async () => {

        try {

            setChecked(!isChecked)

            const value = task.done == 1 ? 0 : 1;
            await updateTaskDone(task.id, value);
            reload();

        } catch (error) {
            alert(error);
        }

    }



    return (
        <View style={styles.taskRow}>
            <Checkbox style={{ padding: 12 }}
                color={isChecked ? primaryColor : undefined}
                value={isChecked}
                onValueChange={toggle}
            />
            <View style={{width : 20,flexWrap:"wrap",flexShrink : 1}}></View>
            <Text style={styles.text}>
                {task.title}
            </Text>
        </View>
    )



}