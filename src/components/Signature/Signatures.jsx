import React from "react";
import { Card } from "antd";
import Signature from "./Signature";

const Signatures = ({
  list,
  handleAssign,
  title,
  requiredSigners,
  state,
  roleToStateMapping,
}) => (
  <Card title={title}>
    {list.map(signature => (
      <Card.Grid key={signature.role}>
        <Signature
          icon={signature.icon}
          isSigned={state >= roleToStateMapping?.[signature.role]}
          role={signature.role}
          signer={
            requiredSigners?.find(([, role]) => role === signature.role)?.[0]
          }
          onAssign={handleAssign}
        />
      </Card.Grid>
    ))}
  </Card>
);

export default Signatures;
