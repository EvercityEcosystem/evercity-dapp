import React, { useEffect, useMemo, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import styles from "./FileHasher.module.less";
import useHashFiles from "../../hooks/useHashFiles";
import { Card } from "antd";
import classnames from "classnames";

const FileHasher = ({ onChange, disabled, maxCount }) => {
  const { ref, files } = useHashFiles({
    maxCount,
    disabled,
  });
  const [isMounted, setIsMounted] = useState(false);

  const isEmpty = useMemo(() => maxCount > files.length, [maxCount, files]);
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
    if (isMounted) {
      onChange(files.map(file => file.hash));
    }
    return () => setIsMounted(false);
  }, [files]);
  return (
    <label
      className={classnames(
        styles.upload,
        isEmpty ? styles["upload--empty"] : styles["upload--notEmpty"],
      )}>
      {files.map(item => (
        <Card key={item.hash} title={item.file.name}>
          Hash: {item.hash}
        </Card>
      ))}
      {isEmpty && <PlusOutlined className={styles.upload__icon} />}
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
