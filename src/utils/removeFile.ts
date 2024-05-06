import fs from "fs";
export const removeFileAsync = async (path: string) => {
  return new Promise((resolve, reject) =>
    fs.rm(path, (error) => {
      if (error) {
        return reject(error.message);
      }
      resolve("");
    })
  );
};
