export const isPositiveNumber = (value) => {
    return !isNaN(value) && Number(value) > 0;
  };
  
  export const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };
  
  export const isNonEmptyString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
  };
  