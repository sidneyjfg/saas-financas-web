export const calculatePercentage = (current, target) => {
    if (!target || target === 0) return 0;
    return Math.min((current / target) * 100, 100).toFixed(2); // Limita a 100%
  };
  