/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-console */
import React from "react";
import { message, Statistic } from "antd";

import SimpleForm from "../components/SimpleForm";

import useXState from "../hooks/useXState";
import usePolkadot from "../hooks/usePolkadot";

import styles from "./CustodianRequests.module.less";

const CustodianRequests = () => {
  const [state, updateState] = useXState({
    amount: "0",
    deadline: "0",
    show: false,
  });
  const { checkMintRequest, checkBurnRequest } = usePolkadot();

  const formConfig = {
    action: {
      label: "Action",
      required: true,
      display: "select",
      span: 24,
      allowClear: false,
      showSearch: true,
      values: [
        { "Check Mint Request": "mintRequestEverUSD" },
        { "Check Burn Request": "burnRequestEverUSD" },
      ],
    },
    address: {
      label: "Address",
      required: true,
      type: "string",
      span: 24,
    },
  };

  const handleSubmit = async values => {
    const { action, address } = values;
    const { amount, deadline } =
      action === "mintRequestEverUSD"
        ? await checkMintRequest(address)
        : await checkBurnRequest(address);

    if (!amount && !deadline) {
      message.warning("No requests from this address");
      updateState({ show: false });
    } else {
      updateState({ amount, deadline, show: true });
    }
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={styles.container}>
      {state.show && (
        <div className={styles.results}>
          <Statistic title="Amount" value={state.amount} />
          <Statistic.Countdown
            title="Deadline"
            value={state?.deadline}
            format="DD HH:mm:ss"
          />
        </div>
      )}
      <SimpleForm
        config={formConfig}
        onSubmit={handleSubmit}
        submitText="Submit"
        className={styles.form}
        labelAlign="left"
        {...layout}
      />
    </div>
  );
};

CustodianRequests.propTypes = {};

CustodianRequests.defaultProps = {};

export default CustodianRequests;
