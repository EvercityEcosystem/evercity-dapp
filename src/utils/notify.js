import { notification } from "antd";

export const transactionCallback =
  message =>
  ({ status }) => {
    if (status.isInBlock) {
      notification.success({
        message,
        description: "Transaction is in block",
      });
    }

    if (status.isFinalized) {
      const { Finalized } = status.toJSON();
      console.info(message, Finalized);

      notification.success({
        message,
        description: "Block finalized",
      });
    }
  };
