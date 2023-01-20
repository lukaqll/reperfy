import RNFS from 'react-native-fs';

const rootDir = RNFS.DownloadDirectoryPath;
const projDir = rootDir + "/repertoires";

const makeDirectory = async (folderPath) => {
    await RNFS.mkdir(rootDir + folderPath)
}

const getFolderContent = async (path) => {
    const reader = await RNFS.readDir(projDir + path)
    return reader
}

const getFileContent = async (path) => {
    const reader = await RNFS.readFile(path)
    return reader
}

const createFile = async (fileName, content) => {
    await init()
    const filePath = `${projDir}/${fileName}`
    await RNFS.writeFile(filePath, content, 'utf8')
    return filePath
}

const deleteFile = async (fileName) => {
    await RNFS.unlink(fileName)
}

const init = async () => {
    let isFolderExists =  await RNFS.exists(projDir)
    if (!isFolderExists) {
        await makeDirectory('/repertoires')
    }
}

export {makeDirectory, getFolderContent, getFileContent, createFile, deleteFile, rootDir, projDir}