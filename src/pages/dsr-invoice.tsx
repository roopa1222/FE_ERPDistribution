import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DsrInvoiceView } from 'src/sections/dsr-invoice/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`DSR-Invoice - ${CONFIG.appName}`}</title>
      </Helmet>

      <DsrInvoiceView />
    </>
  );
}
