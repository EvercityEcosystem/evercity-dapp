export const SUBSTRATE_ROLES = {
  1: "Master",
  2: "Custodian",
  4: "Issuer",
  8: "Investor",
  16: "Auditor",
  32: "Manager",
  128: "Bond Emitter",
  256: "Project Owner",
  512: "Auditor Carbon Credit",
  1024: "Standard Carbon Credit",
  2048: "Investor Carbon Credit",
  4096: "Registry Carbon Credit",
};

export const roleToStateMapping = {
  256: 1,
  512: 2,
  1024: 4,
  4096: 16,
};

export const getAvailableRoles = mask => {
  const masks = Object.keys(SUBSTRATE_ROLES).map(key => parseInt(key, 10));

  if (Object.keys(SUBSTRATE_ROLES).includes(mask)) {
    return mask;
  }

  const roles = [];
  let maskValue = mask;
  masks.reverse().forEach(m => {
    if (m <= maskValue) {
      roles.push(m);
      maskValue -= m;
    }
  });

  return roles;
};
