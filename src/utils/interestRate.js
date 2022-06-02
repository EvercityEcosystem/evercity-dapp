const calculateEffectiveInterestRate = (bond, impactData, period) => {
  const {
    interest_rate_base_value: baseInterest,
    interest_rate_margin_floor: interestMarginFloor,
    interest_rate_margin_cap: interestMarginCap,
    impact_data_max_deviation_cap: impactMaxDeviationCap,
    impact_data_max_deviation_floor: impactMaxDeviationFloor,

    impact_data_baseline: impactBaselineArray,
  } = bond.inner;

  const impactValue = impactData[period]?.impact_data || 0;
  const impactBaseline = impactBaselineArray[period];

  if (impactValue >= impactMaxDeviationCap) {
    return interestMarginFloor;
  }
  if (impactValue <= impactMaxDeviationFloor) {
    return interestMarginCap;
  }
  if (impactValue == impactBaseline) {
    return baseInterest;
  }

  if (impactValue > impactBaseline) {
    return (
      baseInterest -
      ((impactValue - impactBaseline) * (baseInterest - interestMarginFloor)) /
        (impactMaxDeviationCap - impactBaseline)
    );
  }

  return (
    baseInterest +
    ((impactBaseline - impactValue) * (interestMarginCap - baseInterest)) /
      (impactBaseline - impactMaxDeviationFloor)
  );
};

const calculateInterestRate = (bond, impactData, period) => {
  if (!bond) {
    return null;
  }

  const {
    interest_rate_start_period_value: startInterest,
    interest_rate_penalty_for_missed_report: penalty,
    interest_rate_margin_cap: interestMarginCap,
  } = bond.inner;

  // no rate for out-of-date bonds
  if (period === null) {
    return null;
  }

  // special rate for grace period
  if (period === 0) {
    return startInterest;
  }

  const lastPeriod = period - 1;
  const lastPeriodSigned = impactData[lastPeriod]?.signed;

  if (lastPeriodSigned) {
    return calculateEffectiveInterestRate(bond, impactData, lastPeriod);
  }

  const previousInterestRate = calculateInterestRate(
    bond,
    impactData,
    lastPeriod,
  );
  // rate with penalty if impact for previous period wasn't sent or signed
  return Math.min(previousInterestRate + penalty, interestMarginCap);
};

export { calculateInterestRate };
