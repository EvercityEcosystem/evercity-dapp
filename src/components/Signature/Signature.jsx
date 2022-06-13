import React, { useMemo, useState } from "react";
import styles from "./Signature.module.less";
import { Button, Card, Input, Tooltip } from "antd";
import { SUBSTRATE_ROLES } from "../../utils/roles";
import { getCurrentUserAddress } from "../../utils/storage";
import classnames from "classnames";

const Signature = ({ icon, role, onAssign, signer, isSigned = false }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [address, setAddress] = useState();
  const currentAccount = getCurrentUserAddress();

  const signature = useMemo(() => {
    if (signer) {
      return (
        <Tooltip title={signer}>
          <div
            className={classnames(
              styles.signature__address,
              isSigned && styles["signature__address--signed"],
            )}>
            {signer}
          </div>
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
