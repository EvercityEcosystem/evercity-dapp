import React, { useMemo, useState } from "react";
import styles from "./Signature.module.less";
import { Button, Card, Input, message, Tooltip } from "antd";
import { SUBSTRATE_ROLES } from "../../utils/roles";
import { getCurrentUserAddress } from "../../utils/storage";
import classnames from "classnames";
import { CopyOutlined } from "@ant-design/icons";

const Signature = ({ icon, role, onAssign, signer, isSigned = false }) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [address, setAddress] = useState();
  const currentAccount = getCurrentUserAddress();
  const handleAssign = () => {
    onAssign(address, role);
    setIsAssigning(false);
  };

  const signature = useMemo(() => {
    if (signer) {
      return (
        <>
          <div
            className={classnames(
              styles.signature__status,
              isSigned && styles["signature__status--signed"],
            )}>
            {isSigned ? "Signed" : "Pending"}
          </div>
          <div className={styles.signature__info}>
            <Tooltip placement="bottom" title={signer}>
              <span className={styles.signature__address}>{signer}</span>
            </Tooltip>
            <CopyOutlined
              className={styles.copyIcon}
              onClick={() => {
                navigator.clipboard.writeText(signer);
                message.success("Address copied!");
              }}
            />
          </div>
        </>
      );
    }

    if (isAssigning) {
      return (
        <Input
          value={address}
          onInput={e => setAddress(e.target.value)}
          placeholder="Enter address"
          suffix={<Button onClick={handleAssign}>Ok</Button>}
        />
      );
    }

    return (
      <Button type="primary" block onClick={() => setIsAssigning(true)}>
        Assign
      </Button>
    );
  }, [signer, address, isAssigning, currentAccount, role, isSigned]);

  return (
    <Card
      title={SUBSTRATE_ROLES[role]}
      cover={<span className={styles.signature__icon}>{icon}</span>}>
      {signature}
    </Card>
  );
};

export default Signature;
