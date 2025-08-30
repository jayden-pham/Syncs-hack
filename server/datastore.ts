import { dataStore } from './interface';
import fs from 'fs';

const DATABASE = 'database.json';

const data: dataStore = {
  users: [],
  profiles: [],
}

export const loadData = () => {
  //* if database exists
  if (fs.existsSync(DATABASE)) {
    const file = fs.readFileSync(DATABASE, 'utf8');
    //* parse to object
    const parsed = JSON.parse(file);
    //* preserves data and adds new parsed data
    Object.assign(data, parsed);
  }
};

export const saveData = () => {
  fs.writeFileSync(DATABASE, JSON.stringify(data, null, 2), { encoding: 'utf8' });
};

export function getData() {
  return data;
}
