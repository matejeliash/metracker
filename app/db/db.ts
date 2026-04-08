import * as SQLite from "expo-sqlite";
import { Storage } from "expo-sqlite/kv-store";


// only one instance of db object
let db: SQLite.SQLiteDatabase | null = null;

// singleton like, return only one instance
export const getDb = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('test.db');
    }
    return db;
};

// primaryColor in Storage keeps current primary color

export const getDBPrimaryColor = async (): Promise<string | null> => {
    return await Storage.getItem("primaryColor")
}

export const setDBPrimaryColor = async (color: string): Promise<void> => {
    return await Storage.setItem("primaryColor", color)
}

export const createTable = async () => {

    const db = await getDb();

    // get table info from master table if exists
    const exists = await db.getFirstAsync(`SELECT * FROM sqlite_master WHERE type='table' AND name=?`, ["tasks"])

    //create table 
    if (!exists) {
        const res = await db.runAsync(`CREATE TABLE IF NOT EXISTS tasks 
                (id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL, 
                done INTEGER,
                date TEXT NOT NULL);`);

        console.log(res)

        

        // set current date as last date
        const date = new Date().toISOString().split("T")[0]
        await Storage.setItem("lastDate", date)


    }



}


export const insertTask = async (title: string) => {

    const db = await getDb();
    const date = new Date().toISOString().split("T")[0]

    const res = await db.runAsync("INSERT INTO tasks (title, done, date) VALUES (?, ?, ?)", title, 0, date);

    // set lastDate as current date in case
    await Storage.setItem("lastDate", date)
    console.log(res)
}






export const updateTaskTitle = async (id: number, title: string) => {


    const db = await getDb();
    const date = new Date().toISOString().split("T")[0]

    const res = await db.runAsync("UPDATE tasks set title = ?  where id = ? ", [title, id]);
    console.log(res)
}

export const updateTaskDone = async (id: number, done: number) => {


    const db = await getDb();
    const date = new Date().toISOString().split("T")[0]

    const res = await db.runAsync("UPDATE tasks set  done = ? where id = ? ", [done, id]);
    console.log(res)
}

export const deleteTask = async (id: number) => {


    const db = await getDb();
    const date = new Date().toISOString().split("T")[0]

    const res = await db.runAsync("DELETE from tasks  where id = ? ", [id]);
    console.log(res)
}


export type Task = {
    id: number;
    title: string;
    done: number;
    date: string;
}


export const getTasks = async (date: string): Promise<Task[]> => {

    const db = await getDb();
    const res = await db.getAllAsync<Task>(`SELECT * FROM tasks WHERE date = ?`, [date]);
    return res;

}

// must use object for row, just string won't work
type DateRow = {
    date: string;
}

//
export const getDates = async (): Promise<string[]> => {

    const db = await getDb();
    // just saved not repeating dates
    const res = await db.getAllAsync<DateRow>(`SELECT DISTINCT date FROM tasks ORDER BY date DESC`);

    // map {{string}[]} ->string[] 
    return res.map(row => row.date)

}

export const getTodayTasks = async (): Promise<Task[]> => {

    const date = new Date().toISOString().split("T")[0]

    return getTasks(date);

}


export const maybeCopyTasksFromLastDate = async (): Promise<void> => {

    const today = new Date().toISOString().split("T")[0]

    const lastDate = await Storage.getItem("lastDate")
    // if last date is not today copy from last used date
    if (lastDate && (today !== lastDate)) {
        const oldTasks = await getTasks(lastDate);
        oldTasks.map(task => insertTask(task.title))
    }


}







