import React, { useMemo } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

const CarbonCredits = () => {
  const { assets } = useOutletContext();

  const carbonCredits = useMemo(
    () =>
      assets.reduce((credits, project) => {
        const bindedCarbonCredits = project.carbon_credits.map(credit => {
          const foundedReport =
            project.annual_reports[credit.annual_report_index - 1];
          return {
            project_id: project.id,
            count: foundedReport.carbon_credits_count,
            name: foundedReport.carbon_credits_meta.name,
            symbol: foundedReport.carbon_credits_meta.symbol,
            decimals: foundedReport.carbon_credits_meta.decimals,
            ...credit,
          };
        });
        credits.push(...bindedCarbonCredits);
        return credits;
      }, []),
    [assets],
  );

  return <Outlet context={{ carbonCredits }} />;
};

export default CarbonCredits;
