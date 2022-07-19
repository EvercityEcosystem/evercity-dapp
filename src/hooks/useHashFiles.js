import { useCallback, useRef, useState } from "react";
import { blake2AsHex } from "@polkadot/util-crypto";

const getHash = data => blake2AsHex(data);

const useHashFiles = ({ maxCount }) => {
  const _ref = useRef(null);
  const [files, setFiles] = useState([]);

  const ref = useCallback(input => {
    if (input) {
      const isMaxFilex = maxCount > files.length;
      input.addEventListener("change", () => {
        const inputFiles = _ref.current.files;
        for (let i = 0; i < inputFiles.length; i++) {
          const file = inputFiles.item(i);
          const fileReader = new FileReader();
          fileReader.readAsText(file);
          fileReader.addEventListener("loadend", async () => {
            const hash = await getHash(fileReader.result);
            setFiles(oldFiles => [
              ...(isMaxFilex ? [] : oldFiles),
              { file, hash },
            ]);
          });
        }
      });
    }

    _ref.current = input;
  }, []);

  return {
    ref,
    files,
  };
};

export default useHashFiles;
