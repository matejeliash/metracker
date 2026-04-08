
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { getDBPrimaryColor, setDBPrimaryColor } from '../db/db';
import { backupPrimaryColor, useTheme } from "../styles";



type ColorIconProps = {
  hexStr: string;
}



// just icon component representing color
export const ColorIcon: React.FC<ColorIconProps> = ({ hexStr }) => {
  return (<View
    style={{
      width: 25,
      height: 25,
      backgroundColor: hexStr || 'transparent',
      padding: 10,
      borderRadius: 10
    }}
  />
  );

}

export default function SettingsScreen() {



  const {
    primaryColor,
    setPrimaryColor,
    foregroundColor,
    backgroundColor,
    styles
  } = useTheme();


  const loadColorFromDB = async () => {
    const data = await getDBPrimaryColor();
    if (!data) {
      await setDBPrimaryColor(backupPrimaryColor)
      setPrimaryColor(backupPrimaryColor)
      setValue(backupPrimaryColor)
      console.log("color NOT loaded from DB")
    } else {
      changeColor(data)
      console.log("color loaded from DB")

    }


  }

  useEffect(() => {

    try {
      loadColorFromDB();
    } catch (err: any) {
      console.log(err)
    }


  }, []);



  const changeColor = (color: string) => {
    setValue(color);
    setPrimaryColor(color);
    setDBPrimaryColor(color)

  }


  const [value, setValue] = useState<string>("")

  type ColorOption = {
    label: string;
    hexStr: string;
  }

  const colorOptions: ColorOption[] = [


    { label: " red", hexStr: "#911328" },
    { label: " green", hexStr: "#568203" },
    { label: " blue", hexStr: "#4cc9f0" },
    { label: " dark blue", hexStr: "#00509d" },
    { label: " yellow", hexStr: "#b3b02e" },
    { label: " gray", hexStr: "#636c70" },
    { label: " orange", hexStr: "#a35714" },

  ]


  return (

    <View style={{ flex: 1, backgroundColor: backgroundColor }}>
      <View style={styles.container}>
        <Text style={styles.h2}>Select primary color:</Text>
        <View style={{ padding: 10 }}></View>

        <Dropdown
          style={{ padding: 10, backgroundColor: foregroundColor, borderRadius: 20 }}
          placeholderStyle={styles.text}
          data={colorOptions}
          activeColor={foregroundColor}
          selectedTextStyle={styles.text}
          itemTextStyle={styles.text}
          itemContainerStyle={{ padding: 10, backgroundColor: foregroundColor, borderColor: primaryColor, borderRadius: 10 }}
          containerStyle={{ backgroundColor: foregroundColor, borderColor: primaryColor, borderRadius: 10, padding: 10 }}

          onChange={selected => changeColor(selected.hexStr)}
          labelField="label"
          valueField="hexStr"
          value={value}
          // what to show as option colorIcon+ color name
          renderItem={item => {
            return (
              <View style={{ flexDirection: "row" }}>
                <ColorIcon hexStr={item.hexStr}></ColorIcon>
                <View style={{ padding: 10 }} ></View>
                <Text style={styles.text}>{item.label}</Text>
              </View>
            )
          }}
          
          //  render custom color icon
          renderLeftIcon={() => {
            const colorOption = colorOptions.find(d => d.hexStr === value);
            if (colorOption) {
              return (
                <ColorIcon hexStr={colorOption.hexStr}></ColorIcon>
              )

            } else {
              return null;
            }
          }}
        >

        </Dropdown>

      </View>

    </View>

  );
}
