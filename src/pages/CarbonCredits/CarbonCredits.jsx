import React, { useMemo } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

const CarbonCredits = () => {
  const { assets } = useOutletContext();

  const carbonCredits = useMemo(
    () =>
      assets.reduce((credits, project) => {
        const bindedCarbonCredits = project.carbonCredits.map(credit => {
          const foundedReport =
            project.annualReports[credit.annualReportIndex - 1];

          return {
            projectId: project.id,
            count: foundedReport.carbonCreditsCount,
            name: foundedReport.carbonCreditsMeta.name,
            symbol: foundedReport.carbonCreditsMeta.symbol,
            decimals: foundedReport.carbonCreditsMeta.decimals,
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
