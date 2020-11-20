export const SUBSTRATE_ROLES = {
  1: 'master',
  2: 'custodian',
  4: 'issuer',
  8: 'investor',
  16: 'auditor',
  32: 'manager',
};

export const getAvailableRoles = (mask) => {
  const masks = Object.keys(SUBSTRATE_ROLES).map((key) => parseInt(key, 10));

  if (SUBSTRATE_ROLES[mask]) {
    return [SUBSTRATE_ROLES[mask]];
  }

  const roles = [];
  let maskValue = mask;
  masks.reverse().forEach((m) => {
    if (m <= maskValue) {
      roles.push(SUBSTRATE_ROLES[m]);
      maskValue -= m;
    }
  });

  return roles;
};
