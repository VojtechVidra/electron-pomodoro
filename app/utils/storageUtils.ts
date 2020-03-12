import serialize from 'serialize-javascript';

const deserialize = (serializedJavascript: string) => {
  // eslint-disable-next-line no-eval
  return eval('(' + serializedJavascript + ')');
};

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    window.localStorage.setItem(key, serialize(data));
  } catch (error) {
    console.log(error);
  }
};
export const loadFromLocalStorage = (key: string): any => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? deserialize(item) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
