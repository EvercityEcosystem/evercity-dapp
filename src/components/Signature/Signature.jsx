import React, { useMemo, useState } from "react";
import styles from "./Signature.module.less";
import { Button, Card, Input, Tooltip } from "antd";
import { SUBSTRATE_ROLES } from "../../utils/roles";
import { getCurrentUserAddress } from "../../utils/storage";

const Signature = ({ icon, role, onAssign, signer }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [address, setAddress] = useState();
  const currentAccount = getCurrentUserAddress();

  const signature = useMemo(() => {
    if (signer) {
      return (
        <Tooltip title={signer}>
          <div className={styles.signature__address}>{signer}</div>
        </Tooltip>
      );
    }

    if (isAssigning) {
      return (
        <Input
          value={address}
          onInput={e => setAddress(e.target.value)}
          placeholder="Enter address"
          suffix={
            <Button
              onClick={() => {
                onAssign(address, role);
              }}>
              Ok
            </Button>
          }
        />
      );
    }

    return (
      <Button type="primary" block onClick={() => setIsAssigning(true)}>
        Assign
      </Button>
    );
  }, [signer, address, isAssigning, currentAccount]);

  return (
    <Card
      title={SUBSTRATE_ROLES[role]}
      cover={<span className={styles.signature__icon}>{icon}</span>}>
      {signature}
    </Card>
  );
};

export default Signature;
