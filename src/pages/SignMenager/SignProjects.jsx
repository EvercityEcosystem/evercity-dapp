import React, { useMemo } from "react";
import { TableList } from "../../ui";
import { roleToStateMapping } from "../../utils/roles";
import useAssets from "../../hooks/useAssets";
import { useOutletContext } from "react-router-dom";
import { getCurrentUser } from "../../utils/storage";
import Button from "../../ui/Button/Button";

const SignProjects = () => {
  const { signProject } = useAssets();
  const { assets } = useOutletContext();
  const { role, address } = getCurrentUser();
  const onSignProject = projectId => {
    signProject(projectId);
  };

  const projectsColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Action",
      dataIndex: "id",
      render: projectId => (
        <Button type="action" onClick={() => onSignProject(projectId)}>
          Sign
        </Button>
      ),
    },
  ];

  const requiredProjects = useMemo(
    () =>
      assets.reduce((projects, project) => {
        const relatedProject = project.required_signers?.filter(
          signer =>
            signer[0] === address &&
            signer[1] === role &&
            roleToStateMapping[role] >= project.state,
        );

        if (relatedProject.length > 0) {
          projects.push(project);
        }
        return projects;
      }, []),
    [assets],
  );
  return <TableList columns={projectsColumns} dataSource={requiredProjects} />;
};

export default SignProjects;
