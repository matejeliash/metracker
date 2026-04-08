
import Checkbox from 'expo-checkbox';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { TaskProgress } from './components/TaskProgress';
import { getTasks, Task } from './db/db';
import { useTheme } from './styles';


// show all tasks for selected date, no editing allowed
export default function DetailsScreen() {



  const {
    primaryColor,
    backgroundColor,
    styles
  } = useTheme();



  const { selectedDate } = useLocalSearchParams<{ selectedDate: string }>();

  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const data = await getTasks(selectedDate);
    setTasks(data);
  }

  useEffect(() => {
    try {
      loadTasks()
    } catch (err: any) {
      console.log(err)
    }


  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View style={styles.container}
      >


        <Text style={styles.h2}>{`Tasks for date ${selectedDate}`}</Text>



        <TaskProgress tasks={tasks}></TaskProgress>


        {/* add margin so larger task at bottom visible */}
        <FlatList style={{marginBottom:100}}
          data={tasks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            return <View style={styles.taskContainer}>
              <View style={styles.taskRow}>

                 {/* do not add any callback for task completion, just show info */}
                <Checkbox style={{ padding: 12 }}
                  color={item.done == 1 ? primaryColor : undefined}
                  value={item.done == 1 ? true : false}

                />

            <View style={{width : 20,flexWrap:"wrap",flexShrink : 1}}></View>

                <Text style={styles.text}>
                  {item.title}
                </Text>



              </View>
            </View>

          }}
        >

        </FlatList>






      </View>
    </View>
  );
}
