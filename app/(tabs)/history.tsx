import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { getDates } from '../db/db';
import { useTheme } from '../styles';

export default function AboutScreen() {



  const { backgroundColor, styles } = useTheme();

  const router = useRouter();

  const [dates, setDates] = useState<string[]>([]);

  const loadTasks = async () => {
    const data = await getDates();
    setDates(data);
  }

  // load tasks
  useEffect(() => {
    try {
      loadTasks()
    } catch (err: any) {
      console.log(err)
    }


  }, []);



  return (

    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View style={styles.container}>
        <Text style={styles.h2}>Select date</Text>
        <Text style={styles.text}>Here, you will see all the tasks from the selected date, along with their progress.</Text>

        {/* // create flatlist of all dates */}
        {dates.length > 0 &&
          <FlatList
            data={dates}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {

              return (

                <View style={styles.taskContainer}>
                  <Pressable style={styles.taskRow}
                  //  on click go to details of selected date and pass date to screen
                    onPress={() => {
                      router.push({
                        pathname: "/details",
                        params: { selectedDate: item }
                      });
                    }}
                  >
                    <Text style={styles.text} >
                      {item}

                    </Text>
                  </Pressable>
                </View>
              )
            }}
          >

          </FlatList>
        }
      </View>
    </View>
  );
}
