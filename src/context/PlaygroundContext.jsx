import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PlaygroundContext = createContext();

export const languageMap = {
  cpp: {
    id: 54,
    defaultCode:
      "#include <iostream>\n" +
      "using namespace std;\n\n" +
      "int main() {\n" +
      '\tcout << "Hello World!";\n' +
      "\treturn 0;\n" +
      "}",
  },
  java: {
    id: 62,
    defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
    }`,
  },
  python: {
    id: 71,
    defaultCode: `print("Hello World!")`,
  },
  javascript: {
    id: 63,
    defaultCode: `console.log("Hello World!");`,
  },
};

const PlaygroundProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(process.env.REACT_APP_BACKEND_URL + "/api/folders");
      setFolders(result.data);
    };
    fetchData();
  }, []);

  const deleteCard = async (folderId, cardId) => {
    await axios.delete(
      process.env.REACT_APP_BACKEND_URL + `/api/folders/${folderId}/playgrounds/${cardId}`
    );
    setFolders(
      folders.map((folder) =>
        folder._id == folderId
          ? {
              ...folder,
              playgrounds: folder.playgrounds.filter((p) => p._id != cardId),
            }
          : folder
      )
    );
  };

  const deleteFolder = async (folderId) => {
    await axios.delete(process.env.REACT_APP_BACKEND_URL + `/api/folders/${folderId}`);
    setFolders(folders.filter((folder) => folder._id.toString() !== folderId));
  };

  const addFolder = async (folderName) => {
    const result = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/folders", {
      title: folderName,
      playgrounds: [],
    });
    setFolders([...folders, result.data]);
  };

  const addPlayground = async (folderId, playgroundName, language) => {
    try {
      const newPlayground = {
        title: playgroundName,
        language: language,
        code: languageMap[language].defaultCode,
      };
      console.log(newPlayground);
      const result = await axios.post(
        process.env.REACT_APP_BACKEND_URL + `/api/folders/${folderId}/playgrounds`,
        newPlayground
      );
      setFolders(
        folders.map((folder) => {
          return folder._id.toString() === folderId ? result.data : folder;
        })
      );
    } catch (error) {
      console.error("Error adding playground:", error);
    }
  };

  const addPlaygroundAndFolder = async (
    folderName,
    playgroundName,
    cardLanguage
  ) => {
    const newFolder = {
      title: folderName,
      playgrounds: [
        {
          title: playgroundName,
          language: cardLanguage,
          code: languageMap[cardLanguage].defaultCode,
        },
      ],
    };
    const result = await axios.post(
      process.env.REACT_APP_BACKEND_URL + "/api/folders",
      newFolder
    );
    setFolders([...folders, result.data]);
  };

  const editFolderTitle = async (folderId, folderName) => {
    const result = await axios.put(
      process.env.REACT_APP_BACKEND_URL + `/api/folders/${folderId}`,
      { title: folderName }
    );
    setFolders(
      folders.map((folder) => (folder._id === folderId ? result.data : folder))
    );
  };

  const editPlaygroundTitle = async (folderId, cardId, PlaygroundTitle) => {
    const folder = folders.find((folder) => folder._id === folderId);
    const playground = folder.playgrounds.find((p) => p._id === cardId);
    const result = await axios.put(
      process.env.REACT_APP_BACKEND_URL +
        `/api/folders/${folderId}/playgrounds/${cardId}`,
      {
        title: PlaygroundTitle,
        code: playground.code,
        language: playground.language,
      }
    );
    setFolders(
      folders.map((folder) => (folder._id === folderId ? result.data : folder))
    );
  };

  const savePlayground = async (folderId, cardId, newCode, newLanguage) => {
    const result = await axios.put(process.env.REACT_APP_BACKEND_URL+
      `/api/folders/${folderId}/playgrounds/${cardId}`,
      { code: newCode, language: newLanguage }
    );
    setFolders(
      folders.map((folder) => (folder._id === folderId ? result.data : folder))
    );
  };

  const PlayGroundFeatures = {
    folders: folders,
    deleteCard: deleteCard,
    deleteFolder: deleteFolder,
    addFolder: addFolder,
    addPlayground: addPlayground,
    addPlaygroundAndFolder: addPlaygroundAndFolder,
    editFolderTitle: editFolderTitle,
    editPlaygroundTitle: editPlaygroundTitle,
    savePlayground: savePlayground,
  };

  return (
    <PlaygroundContext.Provider value={PlayGroundFeatures}>
      {children}
    </PlaygroundContext.Provider>
  );
};

export default PlaygroundProvider;
