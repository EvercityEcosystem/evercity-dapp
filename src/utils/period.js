import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const bondCurrentPeriod = (bond, id) => {
  const {
    active_start_date: activeStartDate,
    inner
  } = bond;

  const {
    start_period: startPeriodDuration,
    bond_duration: bondDuration,
    payment_period: paymentPeriod,
  } = inner;

  if (!activeStartDate) {
    return null;
  }

  const activationDate = dayjs.unix(activeStartDate / 1000);
  const gracePeriodFinishDate = activationDate.add(startPeriodDuration, 'seconds');

  if (dayjs().isBetween(activationDate, gracePeriodFinishDate)) {
    return 0;
  }

  const currentPeriodNumber = [...Array(bondDuration).keys()].find((index) => {
    const periodNumber = index + 1;
    const periodFinishDate = gracePeriodFinishDate.add(paymentPeriod * periodNumber, 'seconds');
    const periodStartDate = periodFinishDate.subtract(paymentPeriod, 'seconds');

    return dayjs().isBetween(periodStartDate, periodFinishDate);
  });

  // 0 is grace period
  if (currentPeriodNumber !== null && currentPeriodNumber !== undefined) {
    return currentPeriodNumber + 1;
  }

  return null;
};

export const isTimeToSendImpact = (bond) => {
  if (!bond) {
    return [false];
  }

  const periodNumber = bondCurrentPeriod(bond);

  const {
    active_start_date: activeStartDate,
    inner
  } = bond;

  const {
    start_period: startPeriodDuration,
    impact_data_send_period: impactSendPeriodDuration,
    payment_period: paymentPeriod,
  } = inner;

  const activationDate = dayjs.unix(activeStartDate / 1000);
  const gracePeriodFinishDate = activationDate.add(startPeriodDuration, 'seconds');
  const gracePeriodImpactStartDate = gracePeriodFinishDate.subtract(impactSendPeriodDuration, 'seconds');

  if (dayjs().isBetween(gracePeriodImpactStartDate, gracePeriodFinishDate) && periodNumber === 0) {
    return [true, gracePeriodFinishDate];
  }

  const periodFinishDate = gracePeriodFinishDate.add(paymentPeriod * periodNumber, 'seconds');
  const periodImpactStartDate = periodFinishDate.subtract(impactSendPeriodDuration, 'seconds');

  return [
    dayjs().isBetween(periodImpactStartDate, periodFinishDate),
    periodFinishDate
  ];
};

export const isTimeToPayInterest = (bond) => {
  const periodNumber = bondCurrentPeriod(bond);

  if (periodNumber === 0) {
    return false;
  }

  const {
    active_start_date: activeStartDate,
    inner
  } = bond;
  const {
    start_period: startPeriodDuration,
    interest_pay_period: interestPayPeriod,
    payment_period: paymentPeriod,
  } = inner;

  const activationDate = dayjs.unix(activeStartDate / 1000);
  const gracePeriodFinishDate = activationDate.add(startPeriodDuration, 'seconds');

  // interest pay calculations available only for previous period
  // because it's always after period finish date
  const interestPayStartDate = gracePeriodFinishDate.add(paymentPeriod * (periodNumber - 1), 'seconds');
  const interestPayFinishDate = interestPayStartDate.add(interestPayPeriod, 'seconds');

  return dayjs().isBetween(interestPayStartDate, interestPayFinishDate);
};

export const isAfterMaturityDate = (bond) => {
  const {
    active_start_date: activeStartDate,
    inner
  } = bond;
  const {
    start_period: startPeriodDuration,
    payment_period: paymentPeriod,
    bond_duration: bondDuration
  } = inner;

  const activationDate = dayjs.unix(activeStartDate / 1000);
  const gracePeriodFinishDate = activationDate.add(startPeriodDuration, 'seconds');
  const maturityDate = gracePeriodFinishDate.add(paymentPeriod * bondDuration, 'seconds');

  return dayjs().isAfter(maturityDate);
};

export const isTimeToPayMaturity = (bond) => {
  const {
    active_start_date: activeStartDate,
    inner
  } = bond;
  const {
    start_period: startPeriodDuration,
    payment_period: paymentPeriod,
    bond_duration: bondDuration,
    bond_finishing_period: maturityPayPeriod
  } = inner;

  const activationDate = dayjs.unix(activeStartDate / 1000);
  const gracePeriodFinishDate = activationDate.add(startPeriodDuration, 'seconds');

  // end of last period, maturity date and maturity pay start date are the same
  const maturityPayStartDate = gracePeriodFinishDate.add(paymentPeriod * bondDuration, 'seconds');
  const maturityPayFinishDate = maturityPayStartDate.add(maturityPayPeriod, 'seconds');

  return dayjs().isBetween(maturityPayStartDate, maturityPayFinishDate);
};
