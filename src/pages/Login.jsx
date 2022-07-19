import React, { useEffect, useCallback, useContext } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { web3Accounts } from "@polkadot/extension-dapp";

import SimpleForm from "../components/SimpleForm";
import Loader from "../components/Loader";
import { store } from "../components/PolkadotProvider";

import usePolkadot from "../hooks/usePolkadot";
import useXState from "../hooks/useXState";

import { saveCurrentUser } from "../utils/storage";
import { EXTENSION_URL } from "../utils/env";

import styles from "./Login.module.less";
import { SUBSTRATE_ROLES } from "../utils/roles";

const Login = () => {
  const navigate = useNavigate();
  const { accountRegistry } = usePolkadot();
  const { polkadotState } = useContext(store);

  const [accountsState, updateState] = useXState({
    accounts: [],
    roles: [],
    address: null,
  });

  const accountsFormConfig = {
    address: {
      label: "Choose polkadot account",
      required: true,
      display: "select",
      span: 24,
      allowClear: false,
      showSearch: true,
      values: accountsState?.accounts?.map(acc => ({
        [`${acc.meta.name} ${acc.address}`]: acc.address,
      })),
    },
  };

  const rolesFormConfig = {
    role: {
      label: "Choose role",
      required: true,
      display: "select",
      span: 24,
      allowClear: false,
      showSearch: true,
      values: accountsState?.roles?.map(role => ({
        [SUBSTRATE_ROLES[role]]: role,
      })),
    },
  };

  const checkExtension = useCallback(async () => {
    const allAccounts = await web3Accounts();
    if (allAccounts.length) {
      updateState({ accounts: allAccounts });
    }
  }, [updateState]);

  const handleAccountSubmit = async values => {
    const { address } = values;
    const { roles } = await accountRegistry(address);

    if (roles.length === 1) {
      saveCurrentUser(address, roles[0]);
      navigate("/dapp/profile");
      return null;
    }

    updateState({ roles, address });
  };

  const handleRoleSubmit = async values => {
    const { role } = values;
    const { address } = accountsState;

    saveCurrentUser(address, role);
    navigate("/dapp/profile");
  };

  useEffect(() => {
    if (polkadotState.injector) {
      checkExtension();
    }
  }, [checkExtension, polkadotState]);

  let block = (
    <div className={styles.formFooter}>
      <Button
        onClick={() => window.location.reload()}
        type="primary"
        block
        size="large">
        Reload Page to Apply the Extension
      </Button>
      <a
        href={EXTENSION_URL}
        target="_blank"
        style={{ width: "100%" }}
        rel="noreferrer">
        <Button type="default" block size="large">
          Install Extension
        </Button>
      </a>
    </div>
  );

  if (polkadotState.injector) {
    let submitText = "Refresh Accounts";
    let submitFunc = checkExtension;
    let config = {};

    if (accountsState?.accounts?.length) {
      config = accountsFormConfig;
      submitFunc = handleAccountSubmit;
      submitText = "Log in";
    }

    if (accountsState?.roles?.length) {
      config = rolesFormConfig;
      submitFunc = handleRoleSubmit;
      submitText = "Select Role";
    }

    block = (
      <SimpleForm
        config={config}
        onSubmit={submitFunc}
        submitText={submitText}
        submitClassName={styles.submitClassName}
        style={{ width: "100%" }}
        labelAlign="left"
      />
    );
  }

  const injectorDetection = typeof polkadotState.injector === "undefined";
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <Loader spinning={injectorDetection} tip="Detecting polkadot extension">
          {block}
        </Loader>
      </div>
    </div>
  );
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
