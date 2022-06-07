import React from "react";
import styles from "./Signature.module.less";
import { Button, Card } from "antd";
import { SUBSTRATE_ROLES } from "../../utils/roles";

const Signature = ({ icon, role }) => {
  return (
    <Card
      title={SUBSTRATE_ROLES[role]}
      cover={<span className={styles.signature__icon}>{icon}</span>}>
      <Button type="primary" block>
        Assign
      </Button>
      {/*<Input placeholder="Enter address" s/>*/}
    </Card>
  );
};

export default Signature;
