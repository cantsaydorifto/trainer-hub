export const firstWorldCapital = (str: string) => {
  return str[0] ? str[0].toUpperCase() + str.slice(1) : "";
};
