import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/201147111094"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        backgroundColor: '#25D366',
        color: '#ffffff',
        borderRadius: '50%',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'block',
      }}
      className="md:hidden transition-transform duration-200 ease-in-out hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon sx={{ fontSize: 30 }} />
    </a>
  );
}
