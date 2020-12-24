import { useEffect } from 'react';
import {
  message,
} from 'antd';
import SparkMD5 from 'spark-md5';

export default ({ state, updateState, bond }) => {
  const checkDocumentsFormConfig = {
    docs: {
      display: 'file',
      placeholder: 'Upload document',
      accept: '.pdf,.xls,.xlsx',
      span: 24,
      beforeUpload: async (file) => {
        const reader = new FileReader();

        reader.onload = () => {
          const spark = new SparkMD5.ArrayBuffer();
          spark.append(reader.result);
          const filehash = spark.end();

          updateState({ filehash });
        };

        reader.readAsArrayBuffer(file);

        return false;
      },
    },
  };

  useEffect(
    () => {
      const isDocumentValid = [
        bond.inner?.docs_pack_root_hash_main,
        bond.inner?.docs_pack_root_hash_tech,
        bond.inner?.docs_pack_root_hash_legal,
        bond.inner?.docs_pack_root_hash_finance,
      ].includes(state.filehash);

      if (!state.filehash) {
        return;
      }

      if (isDocumentValid) {
        message.success('Document is valid');
        updateState({ filehash: null });
        return;
      }

      message.error('Document is not valid');
      updateState({ filehash: null });
    },
    [state.filehash, bond, updateState],
  );

  return {
    checkDocumentsFormConfig,
  };
};
