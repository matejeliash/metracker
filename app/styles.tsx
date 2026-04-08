// styles.js
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { getDBPrimaryColor, setDBPrimaryColor } from './db/db';

type AnyStyle = ViewStyle | TextStyle | ImageStyle;

export const backupPrimaryColor = "#568203";
export const defaultBackgroundColor = "#0f1012";
export const defaultForegroundColor = "#292c33";
export const defaultTextColor = "#FAFAFA";

// types for all create styles
type ThemeStyles = {

  container: ViewStyle;
  button: ViewStyle;
  taskContainer: ViewStyle;
  taskInput: ViewStyle & TextStyle;
  text: TextStyle;
  heading: TextStyle;
  h2: TextStyle;
  taskRow: ViewStyle;
  modal: ViewStyle;
  modalContainer: AnyStyle;
  outerProgress: ViewStyle;

}

// types for context to expose styling
type ThemeContextType = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  backgroundColor: string;
  foregroundColor: string;
  textColor: string;
  styles: ThemeStyles
}


// global context var
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);





export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [primary, setPrimary] = useState<string>(backupPrimaryColor);

  const background = defaultBackgroundColor;
  const foreground = defaultForegroundColor;
  const text = defaultTextColor;

  // select color from kv store and set it in theme context
  const loadColorFromDB = async () => {
    const data = await getDBPrimaryColor();
    if (!data) {
      await setDBPrimaryColor(backupPrimaryColor)
      setPrimary(backupPrimaryColor)
      console.log("color NOT loaded from DB")
    } else {
      setPrimary(data)
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




  // returns styles, recalculates only if primary color changes 
  const styles = useMemo((): ThemeStyles => StyleSheet.create(
    {
      // general container
      container: {
        backgroundColor: background,
        color: text,
        padding: 20,
        paddingBottom: 60,
      },
      button: {
        fontSize: 20,
        color: text,
        margin: 2,
        backgroundColor: primary,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        height: 50,
        maxWidth: 120,


        borderWidth: 2,
        borderColor: primary,
        borderRadius: 10
      },

      // container for one task elements
      taskContainer: {
        fontSize: 20,
        color: text,
        margin: 2,
        backgroundColor: background,
        padding: 10
      },

      taskInput: {
        fontSize: 15,
        fontWeight: 'bold',
        color: text,
        margin: 2,
        backgroundColor: foreground,
        padding: 20,
        borderWidth: 2,
        borderColor: primary,
        borderRadius: 10
      },

      text: {
        color: text,
        maxWidth: "90%",
        fontSize: 16
      },

      heading: {
        color: text,
        maxWidth: "90%",
        fontSize: 32,
        fontWeight: "bold"
      },

      h2: {
        color: text,
        maxWidth: "90%",
        fontSize: 24,
        fontWeight: "bold"
      },


      taskRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: foreground,
        padding: 10,
        borderRadius: 10

      },

      modal: {
        backgroundColor: background,
        color: text,
        width: "50%",
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10

      },

      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },

      outerProgress: {
        backgroundColor: foreground,
        height: 15,
        borderRadius: 20,

      },

    }



  ), [primary]);

  return (
    <ThemeContext.Provider value={{
      primaryColor: primary,
      setPrimaryColor: setPrimary,
      backgroundColor: background,
      foregroundColor: foreground,
      textColor: text,
      styles,
    }}>
      {children}
    </ThemeContext.Provider>
  );


};

// context creator , used to access and change theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("create theme context error")

  return context;
}