import React, { useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./FileHasher.module.less";
import useHashFiles from "../../hooks/useHashFiles";

const FileHasher = ({ onChange, disabled }) => {
  const { ref, hashs } = useHashFiles({
    maxCount: 1,
    disabled,
  });

  useEffect(() => {
    if (hashs.length > 0) {
      onChange(hashs[0]);
    }
  }, [hashs]);

  return (
    <label className={styles.upload}>
      <PlusOutlined className={styles.upload__icon} />
      <input
        type="file"
        ref={ref}
        className={styles.upload__input}
        disabled={disabled}
      />
    </label>
  );
};

export default FileHasher;
