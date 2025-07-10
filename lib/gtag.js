export const GA_MEASUREMENT_ID = 'G-TS6L0QEVP0'; // replace if needed

export const event = ({ action, params }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params);
  }
};
